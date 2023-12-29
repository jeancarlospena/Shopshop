import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps.jsx";
import { savePaymentMethod } from "../slices/cartSlice.js";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <h1>Payment Method</h1>
      <label className="mb-2">Select payment method.</label>
      <form onSubmit={submitHandler}>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="PayPal"
            value="PayPal"
            checked={paymentMethod === "PayPal" ? true : false}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label className="form-check-label" htmlFor="exampleRadios1">
            PayPal
          </label>
        </div>
        <button type="submit" className="btn btn-primary my-2">
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;
