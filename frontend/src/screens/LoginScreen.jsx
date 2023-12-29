import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer.jsx";
import Loader from "../components/Loader.jsx";
import { useLoginMutation } from "../slices/userApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler} className="mt-3">
        <div className="form-group my-2">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            autoComplete="on"
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            autoComplete="on"
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary my-2"
        >
          Submit
        </button>
        {isLoading && <Loader></Loader>}
      </form>
      <small id="emailHelp" className="form-text text-muted">
        New Customer?{" "}
        <Link
          className=""
          to={redirect ? `/register?redirect=${redirect}` : "/register"}
        >
          Sign Up
        </Link>
      </small>
    </FormContainer>
  );
};

export default LoginScreen;
