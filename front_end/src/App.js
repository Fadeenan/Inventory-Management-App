import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./component/NavBar";
import { ProductProvider } from "./ProductContext";
import ProductsTable from "./component/ProductsTable";

function App() {
  return (
    <div>
      <Router>
        <ProductProvider>
          <NavBar />
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-xm-12 mt-4 mb-4">
                <ProductsTable />
              </div>
            </div>
          </div>
          <Routes>
            {/* คุณสามารถเพิ่ม Route ต่างๆ ที่ต้องการที่นี่ */}
          </Routes>
        </ProductProvider>
      </Router>
    </div>
  );
}

export default App;
