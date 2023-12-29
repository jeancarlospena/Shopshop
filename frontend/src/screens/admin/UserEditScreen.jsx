import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import FormContainer from "../../components/FormContainer.jsx";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/userApiSlice.js";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({ userId, name, email, isAdmin });
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(err?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link
        to="/admin/userlist"
        className="mt-4 btn btn-secondary btn-md"
        tabIndex="-1"
        role="button"
      >
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader></Loader>}
        {isLoading ? (
          <Loader></Loader>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="form-group my-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group my-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-check my-2">
              <input
                type="checkbox"
                checked={isAdmin}
                className="form-check-input"
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label className="form-check-label">Admin Status</label>
            </div>

            <button type="submit" className="btn btn-primary my-2">
              Update
            </button>
          </form>
        )}
      </FormContainer>
      <Link
        to="/admin/userlist"
        className="mt-4 btn btn-secondary btn-md"
        tabIndex="-1"
        role="button"
      >
        Go Back
      </Link>
    </>
  );
};

export default UserEditScreen;
