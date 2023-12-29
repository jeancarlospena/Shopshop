import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import RatingDisplay from "../components/RatingDisplay";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import { useState } from "react";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Meta from "../components/Meta.jsx";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: productId } = useParams();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating before submitting review");
      return;
    }
    if (comment === "") {
      toast.error("Please enter a comment before submitting review");
      return;
    }
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review Submitted");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <div className="container">
            <Link
              to="/"
              className="mb-4 btn btn-secondary btn-md"
              tabIndex="-1"
              role="button"
            >
              Go Back
            </Link>
            <div className="row">
              <div className="col md-5">
                <img src={product.image} className="img-fluid" alt="..." />
              </div>
              <div className="col md-4">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">{product.name}</li>
                  <li className="list-group-item">
                    <RatingDisplay rating={product.rating}></RatingDisplay>
                    {product.numReviews} Reviews
                  </li>
                  <li className="list-group-item">{product.description}</li>
                </ul>
              </div>
              <div className="col md-3">
                <ul className="list-group">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col">Price:</div>
                      <div className="col">{product.price}</div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col">Aveilable:</div>
                      <div className="col">
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    {product.countInStock > 0 && (
                      <div className="form-group">
                        <label htmlFor="quantity">Qty</label>
                        <select
                          name="quantity"
                          className="form-select"
                          aria-label="Default select example"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn btn-dark btn"
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row review">
            <div className="col col-md-6">
              <h2 className="bg-light rounded p-2 my-2">Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ul className="list-group list-group-flush">
                {product.reviews.map((review) => (
                  <li className="list-group-item" key={review._id}>
                    <strong className="my-1">{review.name}</strong>
                    <br></br>
                    <RatingDisplay value={review.rating}></RatingDisplay>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
              <h2 className="bg-light rounded p-2 my-2">Write Review</h2>
              {loadingProductReview && <Loader></Loader>}
              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <div className="form-group">
                    <label className="my-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="form-control my-2"
                    >
                      <option value="">Select rating...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>

                    <label className="my-2" htmlFor="exampleInputEmail1">
                      Comment
                    </label>
                    <textarea
                      type="textarea"
                      rows={3}
                      value={comment}
                      className="form-control my-2"
                      placeholder="Enter comment"
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="btn my-2 btn-primary"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <Message>
                  Please <Link to="/login">login</Link> to write a review
                </Message>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductScreen;
