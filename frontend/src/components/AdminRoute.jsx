import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to="/login" replace></Navigate>
  );
};

export default AdminRoute;
