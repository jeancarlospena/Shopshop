import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate.jsx";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };
  return (
    <>
      <div className="row align-items-center">
        <div className="col">
          <h1>Products</h1>
        </div>
        <div className="col text-end">
          <button
            to="/"
            className="btn btn-secondary btn-sm"
            tabIndex="-1"
            role="button"
            onClick={createProductHandler}
          >
            Create Product
          </button>
        </div>
      </div>
      {loadingCreate && <Loader></Loader>}
      {loadingDelete && <Loader></Loader>}
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">NAME</th>
                <th scope="col">PRICE</th>
                <th scope="col">CATEGORY</th>
                <th scope="col">BRAND</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <th scope="row">{product._id}</th>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Link
                      className="nav-link"
                      to={`/admin/product/${product._id}`}
                    >
                      <FaEdit></FaEdit> Edit
                    </Link>
                  </td>
                  <td>
                    <button
                      to="/"
                      className="btn btn-secondary btn-md"
                      tabIndex="-1"
                      role="button"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash></FaTrash>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={true}
          ></Paginate>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
