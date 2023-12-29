import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer.jsx";
import Loader from "../components/Loader.jsx";
import { useRegisterMutation } from "../slices/userApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <FormContainer>
      <h1>Sign Up</h1>
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
            autoComplete="on"
            type="password"
            className="form-control"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary my-2"
        >
          Register
        </button>
        {isLoading && <Loader></Loader>}
      </form>
      <small id="emailHelp" className="form-text text-muted">
        Alread have an account?{" "}
        <Link
          className=""
          to={redirect ? `/login?redirect=${redirect}` : "/login"}
        >
          Login
        </Link>
      </small>
    </FormContainer>
  );
};

export default RegisterScreen;
