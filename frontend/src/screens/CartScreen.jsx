import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message.jsx";
import { addToCart, removeFromCart } from "../slices/cartSlice.js";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="row">
      <div className="col col-md-8">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ul className="list-group list-group-flush">
            {cartItems.map((item) => (
              <li key={item._id} className="list-group-item">
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="row">
                      <div className="col-6">
                        <img
                          className="img-thumbnail"
                          src={item.image}
                          alt="item.name"
                        />
                      </div>
                      <div className="col-6">
                        <Link
                          className="card-title"
                          to={`/product/${item._id}`}
                        >
                          {item.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="row">
                      <div className="col-4">${item.price}</div>
                      <div className="col-4">
                        {item.countInStock > 0 && (
                          <div className="form-group">
                            <label htmlFor="quantity">Qty</label>
                            <select
                              name="quantity"
                              className="form-select"
                              aria-label="Default select example"
                              // defaultValue={item.qty}
                              value={item.qty}
                              onChange={(e) =>
                                addToCartHandler(item, Number(e.target.value))
                              }
                            >
                              {[...Array(item.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="col-4">
                        <button
                          className="mb-4 btn btn-outline-secondary btn-md"
                          tabIndex="-1"
                          role="button"
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <FaTrash></FaTrash>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-4">
        <ul className="list-group">
          <li className="list-group-item">
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              items
            </h2>
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </li>
          <li className="list-group-item">
            {" "}
            <button
              to="/"
              className="btn btn-secondary btn-md"
              tabIndex="-1"
              role="button"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CartScreen;
