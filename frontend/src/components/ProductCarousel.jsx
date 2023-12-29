import { Link } from "react-router-dom";
import Loader from "./Loader.jsx";
import Message from "./Message.jsx";
import { useGetTopProductsQuery } from "../slices/productsApiSlice.js";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader></Loader>
  ) : (
    <div
      id="carouselExampleCaptions"
      className="carousel slide carousel-dark"
      data-bs-ride="carousel"
    >
      {console.log(products)}
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="carousel-inner">
        {products.map((product, ind) => (
          <div className={`carousel-item ${ind === 0 && "active"}`} key={ind}>
            <img src={product.image} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>
                <Link to={`/product/${product._id}`} className="nav-link">
                  {" "}
                  {product.name}{" "}
                </Link>
              </h5>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default ProductCarousel;
