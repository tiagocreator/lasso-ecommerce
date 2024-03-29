import { ToastContainer } from 'react-toastify';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import {
  Home,
  Contact,
  Login,
  Register,
  Reset,
  Admin,
  Cart,
  CheckoutDetails,
  Checkout,
  CheckoutSuccess,
  OrderHistory,
  OrderDetails,
  Error404,
} from './pages';

// Components
import { Header, Footer, ProductDetails, ReviewProduct } from './components';

import { UseAdminRoute } from './components/adminRoute/AdminRoute';

import './theme.css';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  return (
    <>
      <ToastContainer limit={2} />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />;
          <Route path='/contact' element={<Contact />} />;
          <Route path='/login' element={<Login />} />;
          <Route path='/register' element={<Register />} />;
          <Route path='/reset-password' element={<Reset />} />;
          <Route
            path='/admin/*'
            element={
              <UseAdminRoute>
                <Admin />
              </UseAdminRoute>
            }
          />
          <Route path='/product-details/:id' element={<ProductDetails />} />;
          <Route path='/cart' element={<Cart />} />;
          <Route path='/checkout-details' element={<CheckoutDetails />} />;
          <Route path='/checkout' element={<Checkout />} />;
          <Route path='/checkout-success' element={<CheckoutSuccess />} />;
          <Route path='/order-history' element={<OrderHistory />} />
          <Route path='/order-details/:id' element={<OrderDetails />} />
          <Route path='/review-product/:id' element={<ReviewProduct />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
