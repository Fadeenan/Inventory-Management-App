import React, { useContext, useState, useEffect } from "react";
import { Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ProductContext } from "../ProductContext";

const NavBar = () => {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useContext(ProductContext);
    const [originalProducts, setOriginalProducts] = useState([]);

    // Use useEffect to set the original products when the component mounts or when products.data changes
    useEffect(() => {
        setOriginalProducts(products.data);
    }, [products.data]);

    const updateSearch = (e) => {
        setSearch(e.target.value);
    }

    const filterProduct = (e) => {
        e.preventDefault();
        if (search.trim() === "") {
            setProducts({ data: originalProducts });
        } else {
            const filteredProducts = originalProducts.filter(product => 
                product.name.toLowerCase().includes(search.toLowerCase())
            );
            setProducts({ data: filteredProducts });
        }
    }

    return (
        <Navbar bg="dark" expand="lg" variant="dark" className="px-3">
            <Navbar.Brand as={Link} to="/" style={{ marginRight: '1rem' }}>Inventory Management App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Badge className="mt-2" bg="primary" style={{ marginRight: '1rem' }}>Products In stock {products.data.length}</Badge>
                </Nav>
                <Form onSubmit={filterProduct} className="d-flex ms-auto" style={{ alignItems: 'center' }}>
                    <Link to="/addproduct" className="btn btn-primary btn-sm mr-2" style={{ marginRight: '1rem' }}>Add Product</Link>
                    <FormControl value={search} onChange={updateSearch} type="text" placeholder="Search" className="mr-2" style={{ marginRight: '1rem', width: '200px' }} />
                    <Button type="submit" variant="outline-primary">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
