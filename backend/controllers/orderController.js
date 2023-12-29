import asyncHandler from "../middleware/asyncHandler.js"
import Order from "../models/orderModel.js"

// create new order
// post /api/orders
// private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

  if (orderItems && orderItems.length === 0) {
    res.state(400)
    throw new Error('No order items')
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x, product: x._id, _id: undefined
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    })
    const createOrder = await order.save()
    res.status(201).json(createOrder)
  }
})


// get logged users orders
// get /api/orders/myorders
// private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.status(200).json(orders)
})


// get order by id
// get /api/orders/:id
// private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')
  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }

})


// update order to paid
// put /api/orders/:id/pay
// private/admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    }
    const updatedOrder = await order.save()
    res.status(200).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})


// update order to delivered
// put /api/orders/:id/deliver
// private/adming
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  console.log(order)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.status(200).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})


// get all orders
// get /api/orders/
// private/admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.status(200).json(orders)
})



export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getAllOrders }
