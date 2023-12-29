import { Link } from "react-router-dom";
import RatingDisplay from "./RatingDisplay";

const Product = ({ product }) => {
  return (
    <div className="card mb-3 g-0" style={{ maxWidth: "18rem" }}>
      <Link className="card-img-top" to={`/product/${product._id}`}>
        <img src={product.image} alt="..." className="card-img-top" />
      </Link>

      <div className="card-body">
        <Link
          className="card-title link-underline-opacity-1"
          to={`/product/${product._id}`}
        >
          {product.name}
        </Link>
        <p className="card-subtitle fw-bold mt-2  fs-5 text-muted">
          ${product.price}
        </p>
        <RatingDisplay rating={product.rating}></RatingDisplay>
      </div>
    </div>
  );
};

export default Product;
