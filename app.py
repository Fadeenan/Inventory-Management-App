import logging
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from tortoise.contrib.fastapi import register_tortoise
from fastapi import Depends, FastAPI, HTTPException, status
from models import (supplier_pydantic, supplier_pydanticIn, Supplier, product_pydanticIn, 
product_pydantic, Product, user_pydantic, user_pydanticIn, User)
from typing import List
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
from dotenv import dotenv_values
import jwt
import datetime
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
# Load environment variables
creddentials = dotenv_values(".env")

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

SECRET_KEY = creddentials["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(username: str):
    return await User.get(username=username)

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

# Endpoints
@app.post("/register", response_model=user_pydantic)
async def register(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    user_obj = User(username=user.username, email=user.email, hashed_password=hashed_password)
    await user_obj.save()
    return await user_pydantic.from_tortoise_orm(user_obj)

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=user_pydantic)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError as e:
        logging.error(f"Token decode error: {e}")
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return await user_pydantic.from_tortoise_orm(user)

@app.get("/")
def index():
    return {"Msg": "go to /docs for the API documentation"}

@app.post("/supplier")
async def add_supplier(supplier_info: supplier_pydanticIn): 
    supplier_obj = await Supplier.create(**supplier_info.dict(exclude_unset=True))
    response = await supplier_pydantic.from_tortoise_orm(supplier_obj)
    return {"status": "ok", "data": response}

@app.get("/supplier")
async def get_all_supplier():
    response = await supplier_pydantic.from_queryset(Supplier.all())
    return {"status": "ok", "data": response}

@app.get("/supplier/{supplier_id}")
async def get_specific_supplier(supplier_id: int):
    response = await supplier_pydantic.from_queryset_single(Supplier.get(id=supplier_id))
    return {"status": "ok", "data": response}

@app.put("/supplier/{supplier_id}")
async def update_supplier(supplier_id: int, update_info: supplier_pydanticIn):
    supplier = await Supplier.get(id=supplier_id)
    update_info = update_info.dict(exclude_unset=True)
    supplier.name = update_info.get('name', supplier.name)
    supplier.company = update_info.get('company', supplier.company)
    supplier.phone = update_info.get('phone', supplier.phone)
    supplier.email = update_info.get('email', supplier.email)
    await supplier.save()
    response = await supplier_pydantic.from_tortoise_orm(supplier)
    return {"status": "ok", "data": response}

@app.delete("/supplier/{supplier_id}")
async def delete_supplier(supplier_id: int):
    await Supplier.filter(id=supplier_id).delete()
    return {"status": "ok"}

@app.post("/product/{supplier_id}")
async def add_product(supplier_id: int, product_details: product_pydanticIn):
    supplier = await Supplier.get(id=supplier_id)
    product_details = product_details.dict(exclude_unset=True)
    product_details["revenue"] = product_details["quantity_sold"] * product_details["unit_price"]
    product_obj = await Product.create(**product_details, supplied_by=supplier)
    response = await product_pydantic.from_tortoise_orm(product_obj)
    return {"status": "ok", "data": response}

@app.get("/product")
async def all_products():
    products = await Product.all().prefetch_related("supplied_by")
    products_data = [
        {
            "id": product.id,
            "name": product.name,
            "quantity_in_stock": product.quantity_in_stock,
            "quantity_sold": product.quantity_sold,
            "unit_price": product.unit_price,
            "revenue": product.revenue,
            "supplier_id": product.supplied_by.id
        }
        for product in products
    ]
    return {"status": "ok", "data": products_data}

@app.get("/product/{id}")
async def specific_product(id: int):
    response = await product_pydantic.from_queryset_single(Product.get(id=id))
    return {"status": "ok", "data": response}

@app.put("/product/{id}")
async def update_product(id: int, update_info: product_pydanticIn):
    product = await Product.get(id=id)
    update_info = update_info.dict(exclude_unset=True)
    product.name = update_info.get("name", product.name)
    product.quantity_in_stock = update_info.get("quantity_in_stock", product.quantity_in_stock)
    product.quantity_sold += update_info.get("quantity_sold", 0)
    product.unit_price = update_info.get("unit_price", product.unit_price)
    product.revenue += update_info.get("quantity_sold", 0) * update_info.get("unit_price", 0)
    await product.save()
    response = await product_pydantic.from_tortoise_orm(product)
    return {"status": "ok", "data": response}

@app.delete("/product/{id}")
async def delete_product(id: int):
    await Product.filter(id=id).delete()
    return {"status": "ok"}

class EmailContent(BaseModel):
    message: str
    subject: str

conf = ConnectionConfig(
    MAIL_USERNAME=creddentials["EMAIL"],
    MAIL_PASSWORD=creddentials["PASS"],
    MAIL_FROM=creddentials["EMAIL"],
    MAIL_PORT=465,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

@app.post("/email/{supplier_id}")
async def send_email(supplier_id: int, content: EmailContent):
    supplier = await Supplier.get(id=supplier_id)
    supplier_email = [supplier.email]
    html = f"""
    <h5>Fadeenan Company</h5> 
    <br>
    <p>Dear {supplier.name},</p>
    <p>{content.message}</p>
    <br>
    <p>Best Regards,</p>
    <p>Fadeenan Company</p>
    """
    message = MessageSchema(
        subject=content.subject,
        recipients=supplier_email,
        body=html,
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return {"status": "ok"}

register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)