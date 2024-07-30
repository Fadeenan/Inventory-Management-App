import React from "react";
import { Button } from "react-bootstrap";

const ProductsRow = ({ id, name, quantity_in_stock, quantity_sold, unit_price, revenue, supplier_id, handleDelete, handleUpdate, handleSupplier }) => {
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{quantity_in_stock}</td>
            <td>{quantity_sold}</td>
            <td>{unit_price}</td>
            <td>{revenue}</td>
            <td>
                <Button onClick={() => handleUpdate(id)} variant="outline-info" size="sm" className="mr-2">
                    Update
                </Button>
                <Button 
               onClick={() => handleSupplier(supplier_id)} variant="outline-success" size="sm" className="mr-1">
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
