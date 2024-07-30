import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./component/NavBar";
import { ProductProvider } from "./ProductContext";
import ProductsTable from "./component/ProductsTable";
import AddProduct from "./component/AddProducts";
import UpdateProduct from "./component/UpdateProduct";
import { UpdateProductContextProvider } from "./UpdateProductContext";
import SupplierPage from "./component/SupplierPage";
import { SupplierContextProvider } from "./SupplierContext";

function App() {
  return (
    <div>
      <Router>
        <ProductProvider>
          <UpdateProductContextProvider> {/* Move the context provider here */}
          <SupplierContextProvider>
            <NavBar />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-sm-10 col-xm-12 mt-4 mb-4">
                  <Routes>
                    <Route path="/" element={<ProductsTable />} />
                    <Route path="/updateproduct" element={<UpdateProduct />} />
                    <Route path="/supplierpage" element={<SupplierPage />} />
                    <Route path="/addproduct" element={<AddProduct />} />
                  </Routes>
                </div>
              </div>
            </div>
            </SupplierContextProvider>
          </UpdateProductContextProvider>
        </ProductProvider>
      </Router>
    </div>
  );
}

export default App;
