import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/userApiSlice.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };
  return (
    <>
      <h1>Users</h1>
      {loadingDelete && <Loader></Loader>}
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">USER</th>
              <th scope="col">EMAIL</th>
              <th scope="col">ADMIN</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <th scope="row">{user._id}</th>
                <td>{user.name}</td>
                <td>
                  <Link to={`mailto:${user.email}`} className="nav-link">
                    {user.email}
                  </Link>
                </td>
                <td> {user.isAdmin ? <FaCheck /> : <FaTimes></FaTimes>}</td>

                <td>
                  <Link
                    className="nav-link"
                    to={`/admin/user/${user._id}/edit`}
                  >
                    <FaEdit></FaEdit>Edit
                  </Link>
                </td>
                <td>
                  <button
                    to="/"
                    className="btn btn-secondary btn-md"
                    tabIndex="-1"
                    role="button"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash></FaTrash>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default UserListScreen;
