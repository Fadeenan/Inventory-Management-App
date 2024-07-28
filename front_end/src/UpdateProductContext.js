import React, { createContext, useState } from "react";

export const UpdateContext = createContext();

export const UpdateProductContextProvider = (props) => {
    const [updateProductInfo, setUpdateInfo] = useState({
        ProductName: "",
        QuantityInStock: 0,
        QuantitySold: 0,
        UnitPrice: 0,
        Revenue: 0,
        ProductId: ""
    });

    return (
        <UpdateContext.Provider value={[updateProductInfo, setUpdateInfo]}>
            {props.children}
        </UpdateContext.Provider>
    );
};
