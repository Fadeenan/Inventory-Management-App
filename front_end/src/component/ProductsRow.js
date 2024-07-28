import React from "react";
import { Button } from "react-bootstrap";

const ProductsRow = ({ id, name, quantity_in_stock, quantity_sold, unit_price, revenue, handleDelete }) => {
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{quantity_in_stock}</td>
            <td>{quantity_sold}</td>
            <td>{unit_price}</td>
            <td>{revenue}</td>
            <td>
                <Button variant="outline-info" size="sm" className="mr-2">
                    Update
                </Button>
                <Button variant="outline-success" size="sm" className="mr-1">
                    Supplier
                </Button>
                <Button onClick={() => handleDelete(id)} variant="outline-danger" size="sm" className="mr-2">
                    Delete
                </Button>
            </td>
        </tr>
    );
}

export default ProductsRow;
