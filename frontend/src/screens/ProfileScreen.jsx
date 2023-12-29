import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import { useProfileMutation } from "../slices/userApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice.js";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="row">
      <div className="col col-md-3">
        <h2>User Profile</h2>
        <form onSubmit={submitHandler} className="mt-3">
          <div className="form-group my-2">
            <label htmlFor="exampleInputEmail1">Name</label>
            <input
              autoComplete="on"
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              autoComplete="on"
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group my-2">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              autoComplete="on"
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="exampleInputPassword1">Confirm password</label>
            <input
              autoComplete="off"
              type="password"
              className="form-control"
              placeholder="Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loadingUpdateProfile}
            className="btn btn-primary my-2"
          >
            Update Profile
          </button>
          {loadingUpdateProfile && <Loader></Loader>}
        </form>
      </div>
      <div className="col col-md-9">
        {isLoading ? (
          <Loader></Loader>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <h2>My Orders</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">DATE</th>
                  <th scope="col">TOTAL</th>
                  <th scope="col">PAID</th>
                  <th scope="col">DELIVERED</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <th scope="row">{order._id}</th>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes></FaTimes>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes></FaTimes>
                      )}
                    </td>
                    <td>
                      <Link className="nav-link" to={`/orders/${order._id}`}>
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
