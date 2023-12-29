// import { Navbar, Nav, Container } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/userApiSlice.js";
import { logout } from "../slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox.jsx";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container-md">
        <Link className="navbar-brand" to="/">
          Shopshop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <SearchBox></SearchBox>
            </li>
            {userInfo ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userInfo.name}
                </a>
                <ul className="dropdown-menu">
                  <li className="nav-item">
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" onClick={logoutHandler}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <FaUser></FaUser> Sign In
                </Link>
              </li>
            )}

            {userInfo && userInfo.isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin Actions
                </a>
                <ul className="dropdown-menu">
                  <li className="nav-item">
                    <Link className="dropdown-item" to="/admin/productlist">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/userlist">
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/orderlist">
                      Orders
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            <li className="nav-item position-relative">
              <Link className="nav-link " aria-current="page" to="/cart">
                <FaShoppingCart></FaShoppingCart> Cart
                {cartItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems.reduce((acc, currItm) => acc + currItm.qty, 0)}
                    <span className="visually-hidden">
                      {cartItems.length} items in cart
                    </span>
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
