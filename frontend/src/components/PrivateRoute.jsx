import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to="/login" replace></Navigate>
  );
};

export default PrivateRoute;
