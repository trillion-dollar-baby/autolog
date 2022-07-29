const express = require("express")
const User = require("../models/user")
const tokens = require("../utils/tokens")
const security = require("../middleware/security")
const router = express.Router()

// endpoint to login user based on data in request body
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body)
    const token = tokens.createUserJwt(user)
    return res.status(200).json({ user, token })
  } catch (err) {
    next(err)
  }
})

// endpoint to register user based on data in request body
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body)
    const token = tokens.createUserJwt(user)
    return res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
})

// endpoint to get data of user based on email which was contained in token payload
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    const user = await User.fetchUserById(id);
    const publicUser = User.makePublicUser(user)
    return res.status(200).json({ user: publicUser })
  } catch (err) {
    next(err)
  }
})

// endpoint to update user credentials (excluding password)

router.patch("/", security.requireAuthenticatedUser, async(req,res,next) => {
  try {
    // get credentials user want to change
    const newCredentials = req.body

    // get user id and email to fetch
    const { id } = res.locals.user

    // get user's existing credentials and get object with non-sensitive data
    const oldUser = await User.fetchUserById(id);
    const oldCredentials = User.makePublicUser(oldUser);

    // update
    const updatedUser = await User.updateCredentials(oldCredentials.id, newCredentials, oldCredentials);
    
    // remove sensitive data
    const publicUpdatedUser = User.makePublicUser(updatedUser);

    return res.status(201).json({user: publicUpdatedUser});
  } catch (error) {
    next(error)
  }
})

// endpoint to only update user password
router.patch("/password", security.requireAuthenticatedUser, async(req,res,next) => {
  try {
    // get credentials user want to change
    const newCredentials = req.body;

    // get user id
    const { id } = res.locals.user;

    // await request
    const result = await User.updatePassword(id, newCredentials);

    // return result message
    return res.status(201).json({message: "Password successfully changed"});

  } catch (error) {
    next(error)
  }
})

module.exports = router