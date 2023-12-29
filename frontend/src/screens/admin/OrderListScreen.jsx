import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice.js";
import { Link } from "react-router-dom";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  return (
    <>
      <h1>Orders</h1>
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
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {" "}
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes></FaTimes>
                  )}
                </td>
                <td>
                  {" "}
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
      )}
    </>
  );
};

export default OrderListScreen;
