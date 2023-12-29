import { useParams, Link } from "react-router-dom";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import { useSelector } from "react-redux/";
import { useEffect } from "react";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import {
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice.js";
import { isRejected } from "@reduxjs/toolkit";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currancy: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (error) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment successful");
  }
  function onError(err) {
    toast.error(err.message);
  }
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <Loader></Loader>
  ) : error ? (
    <Message variant="danger"></Message>
  ) : (
    <>
      <h1>Oder {order._id}</h1>
      <div className="row">
        <div className="col col-md-8">
          <ul className="list-group list-group-flush">
            <li className="list-group-item ">
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode}{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </li>
            <li className="list-group-item">
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </li>
            <li className="list-group-item">
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ul key={index} className="list-group ">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col col-md-2">
                        {" "}
                        <img
                          className="img-fluid rounded"
                          src={item.image}
                          alt={item.name}
                        ></img>
                      </div>
                      <div className="col">
                        <Link
                          className="nav-link"
                          to={`/products/${item.product}`}
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="col col-md-4">
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </div>
                    </div>
                  </li>
                </ul>
              ))}
            </li>
          </ul>
        </div>
        <div className="col col-md-4">
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h2>Order Summary</h2>
              </li>

              <li className="list-group-item">
                <div className="row">
                  <div className="col">Items:</div>{" "}
                  <div className="col">{order.itemsPrice}</div>{" "}
                </div>
                <div className="row">
                  <div className="col">Shipping:</div>{" "}
                  <div className="col">${order.shippingPrice}</div>{" "}
                </div>
                <div className="row">
                  <div className="col">Tax:</div>{" "}
                  <div className="col">${order.taxPrice}</div>{" "}
                </div>
                <div className="row">
                  <div className="col">Total:</div>{" "}
                  <div className="col">${order.totalPrice}</div>{" "}
                </div>
              </li>
              {error && (
                <li className="list-group-item">
                  <Message variant="danger">{error}</Message>
                </li>
              )}
              {!order.isPaid && (
                <li className="list-group-item">
                  {loadingPay && <Loader></Loader>}
                  {isPending ? (
                    <Loader></Loader>
                  ) : (
                    <div>
                      <PayPalScriptProvider
                        options={{
                          clientId: paypal.clientId,
                        }}
                      >
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                </li>
              )}

              {loadingDeliver && <Loader></Loader>}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <li className="list-group-item">
                    <button
                      to="/"
                      className="btn btn-secondary btn-md"
                      tabIndex="-1"
                      role="button"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Delivered
                    </button>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
