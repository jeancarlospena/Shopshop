import CheckoutSteps from "../components/CheckoutSteps.jsx";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { useCreateOrderMutation } from "../slices/ordersApiSlice.js";
import { clearCartItems } from "../slices/cartSlice.js";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/orders/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="row">
        <div className="col col-md-8">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </li>
            <li className="list-group-item">
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </li>
            <li className="list-group-item">
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ul className="list-group list-group-flush">
                  {cart.cartItems.map((item, index) => (
                    <li className="list-group-item" key={index}>
                      <div className="row">
                        <div className="col col-md-2">
                          <img
                            className="img-fluid rounded"
                            src={item.image}
                            alt={item.name}
                          ></img>
                        </div>
                        <div className="col">
                          <Link
                            className="nav-link"
                            to={`/products/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </div>
                        <div className="col col-md-4">
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className="col col-md-4">
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h2>Order Summary</h2>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Items:</div>{" "}
                  <div className="col">{cart.itemsPrice}</div>{" "}
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Shipping:</div>{" "}
                  <div className="col">${cart.shippingPrice}</div>{" "}
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Tax:</div>{" "}
                  <div className="col">${cart.taxPrice}</div>{" "}
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Total:</div>{" "}
                  <div className="col">${cart.totalPrice}</div>{" "}
                </div>
              </li>
              {error && (
                <li className="list-group-item">
                  <Message variant="danger">{error}</Message>
                </li>
              )}
              <li className="list-group-item">
                <button
                  className=" btn btn-secondary btn-md"
                  tabIndex="-1"
                  role="button"
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
                {isLoading && <Loader></Loader>}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
