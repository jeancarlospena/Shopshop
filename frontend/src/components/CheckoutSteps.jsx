import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="navbar navbar-expand navbar-light justify-content-center mb-4">
      <div className="navbar-nav">
        {step1 ? (
          <Link className="nav-link" to="/login">
            Sign In
          </Link>
        ) : (
          <Link className="nav-link disabled" to="/login">
            Sign In
          </Link>
        )}

        {step2 ? (
          <Link className="nav-link" to="/shipping">
            Shipping
          </Link>
        ) : (
          <Link className="nav-link disabled" to="/shipping">
            Shipping
          </Link>
        )}

        {step3 ? (
          <Link className="nav-link" to="/payment">
            Payment
          </Link>
        ) : (
          <Link className="nav-link disabled" to="/payment">
            Payment
          </Link>
        )}

        {step4 ? (
          <Link className="nav-link" to="/placeorder">
            Place Order
          </Link>
        ) : (
          <Link className="nav-link disabled" to="/placeorder">
            Place Order
          </Link>
        )}
      </div>
    </nav>
  );
};

export default CheckoutSteps;
