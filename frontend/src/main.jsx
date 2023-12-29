import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { HelmetProvider } from "react-helmet-async";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import HomeScreen from "./screens/HomeScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import CartScreen from "./screens/CartScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import OrderListScreen from "./screens/admin/OrderListScreen.jsx";
import ProductListScreen from "./screens/admin/ProductListScreen.jsx";
import ProductEditScreen from "./screens/admin/ProductEditScreen.jsx";
import UserListScreen from "./screens/admin/UsersListScreen.jsx";
import UserEditScreen from "./screens/admin/UserEditScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen></HomeScreen>}></Route>
      <Route
        path="/search/:keyword"
        element={<HomeScreen></HomeScreen>}
      ></Route>
      <Route
        path="/page/:pageNumber"
        element={<HomeScreen></HomeScreen>}
      ></Route>
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen></HomeScreen>}
      ></Route>

      <Route
        path="/product/:id"
        element={<ProductScreen></ProductScreen>}
      ></Route>
      <Route path="/cart" element={<CartScreen></CartScreen>}></Route>
      <Route path="/login" element={<LoginScreen></LoginScreen>}></Route>
      <Route
        path="/register"
        element={<RegisterScreen></RegisterScreen>}
      ></Route>

      <Route path="" element={<PrivateRoute></PrivateRoute>}>
        <Route
          path="/shipping"
          element={<ShippingScreen></ShippingScreen>}
        ></Route>
        <Route
          path="/payment"
          element={<PaymentScreen></PaymentScreen>}
        ></Route>
        <Route
          path="/placeorder"
          element={<PlaceOrderScreen></PlaceOrderScreen>}
        ></Route>
        <Route path="/orders/:id" element={<OrderScreen></OrderScreen>}></Route>
        <Route
          path="/profile"
          element={<ProfileScreen></ProfileScreen>}
        ></Route>
      </Route>
      <Route path="" element={<AdminRoute></AdminRoute>}>
        <Route
          path="admin/orderlist"
          element={<OrderListScreen></OrderListScreen>}
        ></Route>

        <Route
          path="/admin/productlist"
          element={<ProductListScreen></ProductListScreen>}
        ></Route>
        <Route
          path="/admin/productlist/page/:pageNumber"
          element={<ProductListScreen></ProductListScreen>}
        ></Route>
        <Route
          path="/admin/product/:id"
          element={<ProductEditScreen></ProductEditScreen>}
        ></Route>
        <Route
          path="/admin/userlist"
          element={<UserListScreen></UserListScreen>}
        ></Route>
        <Route
          path="/admin/user/:id/edit"
          element={<UserEditScreen></UserEditScreen>}
        ></Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router}></RouterProvider>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
