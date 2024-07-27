# main.py


from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI




app = FastAPI()

@app.get('/')
def index():
    return {"Msg: Hello"}

register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models" : ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)