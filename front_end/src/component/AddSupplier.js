import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const AddSupplier = () => {
    const [supplierInfo, setSupplierInfo] = useState({
        name: "",
        email: "",
        phone: "",
        company: ""
    });

    const updateForm = (e) => {
        setSupplierInfo({ ...supplierInfo, [e.target.name]: e.target.value });
    };

    const postData = async (e) => {
        e.preventDefault();
        console.log(supplierInfo);

        const url = "http://localhost:8000/supplier";

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
            body: JSON.stringify(supplierInfo)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Supplier added successfully");
        } else {
            alert("Failed to add supplier: " + result.detail);
        }

        setSupplierInfo({
            name: "",
            email: "",
            phone: "",
            company: ""
        });
    };

    return (
        <Card>
            <Card.Body>
                <Form onSubmit={postData}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={supplierInfo.name}
                            onChange={updateForm}
                            placeholder="Supplier's Name"
                        />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={supplierInfo.email}
                            onChange={updateForm}
                            placeholder="Email Address"
                        />
                    </Form.Group>

                    <Form.Group controlId="phone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={supplierInfo.phone}
                            onChange={updateForm}
                            placeholder="Phone"
                        />
                    </Form.Group>

                    <Form.Group controlId="company">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            type="text"
                            name="company"
                            value={supplierInfo.company}
                            onChange={updateForm}
                            placeholder="Company"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddSupplier;
