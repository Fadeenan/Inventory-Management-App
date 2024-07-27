import React, { useContext } from "react";
import { Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ProductContext } from "../ProductContext";

const NavBar = () => {
    const [products, setProducts] = useContext(ProductContext)
    return (
        <Navbar bg="dark" expand="lg" variant="dark" className="px-3">
        <Navbar.Brand as={Link} to="/" style={{ marginRight: '1rem' }}>Inventory Management App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Badge className="mt-2" bg="primary" style={{ marginRight: '1rem' }}>Products In stock {
                products.data.length}</Badge>
            </Nav>
            <Form className="d-flex ms-auto" style={{ alignItems: 'center' }}>
                <Link to="/addproduct" className="btn btn-primary btn-sm mr-2" style={{ marginRight: '1rem' }}>Add Product</Link>
                <FormControl type="text" placeholder="Search" className="mr-2" style={{ marginRight: '1rem', width: '200px' }} />
                <Button type="submit" variant="outline-primary">Search</Button>
            </Form>
        </Navbar.Collapse>
    </Navbar>
    );
}

export default NavBar;
