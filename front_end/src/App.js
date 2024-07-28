import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./component/NavBar";
import { ProductProvider } from "./ProductContext";
import ProductsTable from "./component/ProductsTable";
import AddProduct from "./component/AddProducts";

function App() {
  return (
    <div>
      <Router>
        <ProductProvider>
          <NavBar />
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-xm-12 mt-4 mb-4">
                <Routes>
                  <Route path="/" element={<ProductsTable />} />
                  <Route path="/addproduct" element={<AddProduct />} />
                </Routes>
              </div>
            </div>
          </div>
        </ProductProvider>
      </Router>
    </div>
  );
}

export default App;
