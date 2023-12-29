import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate.jsx";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel.jsx";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel></ProductCarousel>
      ) : (
        <Link
          to="/"
          className="mb-4 btn btn-secondary btn-md"
          tabIndex="-1"
          role="button"
        >
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <div className="row" sm={12} md={6} lg={4} xl={3}>
            {data.products.map((product) => {
              return <Product key={product._id} product={product}></Product>;
            })}
          </div>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          ></Paginate>
        </>
      )}
      {keyword && (
        <Link
          to="/"
          className="mb-4 btn btn-secondary btn-md"
          tabIndex="-1"
          role="button"
        >
          Go Back
        </Link>
      )}
    </>
  );
};

export default HomeScreen;
