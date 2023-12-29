import { useState } from "react";
import FormContainer from "../components/FormContainer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice.js";
import CheckoutSteps from "../components/CheckoutSteps.jsx";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <h1>Shipping</h1>
      <form onSubmit={submitHandler} className="mt-3">
        <div className="form-group my-2">
          <label htmlFor="exampleInputEmail1">Address</label>
          <input
            autoComplete="on"
            type="text"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Street address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="exampleInputEmail1">City</label>
          <input
            autoComplete="on"
            type="text"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="exampleInputPassword1">Postal Code</label>
          <input
            autoComplete="on"
            type="text"
            className="form-control"
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="exampleInputPassword1">Country</label>
          <input
            autoComplete="on"
            type="text"
            className="form-control"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary my-2">
          Continue
        </button>
      </form>
    </FormContainer>
  );
};

export default ShippingScreen;
