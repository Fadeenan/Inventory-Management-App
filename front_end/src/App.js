import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './component/NavBar';
import { ProductProvider } from './ProductContext';
import ProductsTable from './component/ProductsTable';
import AddProduct from './component/AddProducts';
import UpdateProduct from './component/UpdateProduct';
import { UpdateProductContextProvider } from './UpdateProductContext';
import SupplierPage from './component/SupplierPage';
import { SupplierContextProvider } from './SupplierContext';
import { AuthProvider } from './AuthContext';
import Login from './component/Login';
import Register from './component/Register';
import PrivateRoute from './component/PrivateRoute';

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <UpdateProductContextProvider>
              <SupplierContextProvider>
                <NavBar />
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-sm-10 col-xm-12 mt-4 mb-4">
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<PrivateRoute />}>
                          <Route path="/" element={<ProductsTable />} />
                          <Route path="/updateproduct" element={<UpdateProduct />} />
                          <Route path="/supplierpage" element={<SupplierPage />} />
                          <Route path="/addproduct" element={<AddProduct />} />
                        </Route>
                      </Routes>
                    </div>
                  </div>
                </div>
              </SupplierContextProvider>
            </UpdateProductContextProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
