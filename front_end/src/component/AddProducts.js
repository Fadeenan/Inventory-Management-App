import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";

const AddProduct = () => {
    const [productInfo, setProductInfo] = useState({
        ProductName: "",
        QuantityInStock: 0,
        QuantitySold: 0,
        UnitPrice: 0,
        Revenue: 0,
        Supplier: ""
    });

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/supplier")
            .then(resp => resp.json())
            .then(result => {
                if (result.status === "ok") {
                    setSuppliers(result.data);
                } else {
                    alert("Failed to fetch suppliers");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Failed to fetch suppliers");
            });
    }, []);

    const updateForm = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    };

    const postData = async (e) => {
        e.preventDefault();
        console.log(productInfo);

        const url = "http://localhost:8000/product/" + productInfo.Supplier;

        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                name: productInfo.ProductName,
                quantity_in_stock: productInfo.QuantityInStock,
                quantity_sold: productInfo.QuantitySold,
                unit_price: productInfo.UnitPrice,
                revenue: productInfo.Revenue
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Product added successfully");
        } else {
            alert("Failed to add product: " + result.detail);
        }

        setProductInfo({
            ProductName: "",
            QuantityInStock: 0,
            QuantitySold: 0,
            UnitPrice: 0,
            Revenue: 0,
            Supplier: ""
        });
    };

    return (
        <Card>
            <Card.Body>
                <Form onSubmit={postData}>
                    <Form.Group controlId="ProductName">
                        <Form.Label>Product Name <span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="ProductName"
                            value={productInfo.ProductName}
                            onChange={updateForm}
                            placeholder="Product Name"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="QuantityInStock">
                        <Form.Label>Quantity In Stock <span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="QuantityInStock"
                            value={productInfo.QuantityInStock}
                            onChange={updateForm}
                            placeholder="Quantity In Stock"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="QuantitySold">
                        <Form.Label>Quantity Sold <span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="QuantitySold"
                            value={productInfo.QuantitySold}
                            onChange={updateForm}
                            placeholder="Quantity Sold"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="UnitPrice">
                        <Form.Label>Unit Price <span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="UnitPrice"
                            value={productInfo.UnitPrice}
                            onChange={updateForm}
                            placeholder="Unit Price"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="Revenue">
                        <Form.Label>Revenue <span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="Revenue"
                            value={productInfo.Revenue}
                            onChange={updateForm}
                            placeholder="Revenue"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="Supplier">
                        <Form.Label>Supplier <span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control
                            as="select"
                            name="Supplier"
                            value={productInfo.Supplier}
                            onChange={updateForm}
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddProduct;
