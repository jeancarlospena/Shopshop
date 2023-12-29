import asyncHandler from "../middleware/asyncHandler.js"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"

// Auth user and get token
// post /api/users/login
const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body

  const user = await User.findOne({ "email": email.toLowerCase() })
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// Register user
// post /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExist = await User.findOne({ "email": email.toLowerCase() })
  if (userExist) {
    res.status(400)
    throw new Error('User already exists')
  }
  const user = await User.create({
    name, "email": email.toLowerCase, password
  })

  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// Logout user / Clear cookie
// post /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expiresIn: new Date(0) })
  res.status(200).json({ message: 'Logged out successfully' })
})

// Get user profile
// get /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Update user profile
// put /api/users/profile
// Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Get users
// get /api/users
// Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
})

// Get user by id
// get /api/users/:id
// Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Delete users
// delete /api/users/:id
// Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Cannot delete admin user')
    }
    await User.deleteOne({ _id: user._id })
    res.status(200).json({ message: 'User deleted successfully' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Admin updates user
// put /api/users/:id
// Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
}