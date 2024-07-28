import React, { useContext, useEffect } from "react";
import { Table } from 'react-bootstrap';
import { ProductContext } from "../ProductContext";
import ProductsRow from "./ProductsRow";
import { useNavigate } from 'react-router-dom';
import { UpdateContext } from "../UpdateProductContext"; // แก้ไขการนำเข้า

const ProductsTable = () => {
    const [products, setProducts] = useContext(ProductContext);
    const [updateProductInfo, setUpdateProductInfo] = useContext(UpdateContext); // แก้ไขการใช้ useContext

    let navigate = useNavigate();

    const handleDelete = (id) => {
        fetch("http://127.0.0.1:8000/product/" + id, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            }
            throw new Error('Product deletion failed');
        })
        .then(result => {
            if (result.status === 'ok') {
                const filteredProducts = products.data.filter((product) => product.id !== id);
                setProducts({ data: [...filteredProducts] });
                alert("Product deleted");
            } else {
                alert("Product deletion failed");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Product deletion failed");
        });
    };

    const handleUpdate = (id) => {
        const product = products.data.find(product => product.id === id); // แก้ไขการค้นหา product
        setUpdateProductInfo({
            ProductName: product.name,
            QuantityInStock: product.quantity_in_stock,
            QuantitySold: product.quantity_sold,
            UnitPrice: product.unit_price,
            Revenue: product.revenue,
            ProductId: id
        });
        navigate("/updateproduct");
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/product")
            .then(resp => resp.json())
            .then(results => {
                console.log(results);
                setProducts({ "data": [...results.data] });
            });
    }, [setProducts]);

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Product Name</th>
                        <th>Quantity In Stock</th>
                        <th>Quantity Sold</th>
                        <th>Unit Price</th>
                        <th>Revenue</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.data.map(product => (
                        <ProductsRow
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            quantity_in_stock={product.quantity_in_stock}
                            quantity_sold={product.quantity_sold}
                            unit_price={product.unit_price}
                            revenue={product.revenue}
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductsTable;
