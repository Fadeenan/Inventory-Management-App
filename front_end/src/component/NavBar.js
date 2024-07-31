import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ProductContext } from '../ProductContext';
import { AuthContext } from '../AuthContext';

const NavBar = () => {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useContext(ProductContext);
    const { authToken, setAuthToken } = useContext(AuthContext);
    const [originalProducts, setOriginalProducts] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        if (Array.isArray(products.data)) {
            setOriginalProducts(products.data);
        }
    }, [products]);

    const updateSearch = (e) => {
        setSearch(e.target.value);
    };

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
    };

    const handleLogout = () => {
        setAuthToken(null);
        navigate('/login');
    };

    return (
        <Navbar bg="dark" expand="lg" variant="dark" className="px-3">
            <Navbar.Brand as={Link} to="/" style={{ marginRight: '1rem' }}>Inventory Management App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {authToken && (
                        <Badge className="mt-2" bg="primary" style={{ marginRight: '1rem' }}>Products In stock {products.data.length}</Badge>
                    )}
                </Nav>
                {authToken && (
                    <Form onSubmit={filterProduct} className="d-flex ms-auto" style={{ alignItems: 'center' }}>
                        <Link to="/addproduct" className="btn btn-primary btn-sm mr-2" style={{ marginRight: '1rem' }}>Add Product</Link>
                        <FormControl value={search} onChange={updateSearch} type="text" placeholder="Search" className="mr-2" style={{ marginRight: '1rem', width: '200px' }} />
                        <Button type="submit" variant="outline-primary">Search</Button>
                    </Form>
                )}
                {authToken ? (
                    <Button onClick={handleLogout} variant="outline-danger" className="ms-3">Logout</Button>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline-light ms-3">Login</Link>
                        <Link to="/register" className="btn btn-outline-light ms-3">Register</Link>
                    </>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
