const express = require('express')
const { SignUp, SignIn, logout } = require('../controllers/login')

const { auth } = require('../Middlewares/auth')
const router = express.Router()
router.post('/signup', SignUp)
router.post('/signIn', SignIn)
router.post('/logout', logout)
router.get('/check-auth', auth, (req, res) => {
    res.status(200).json({ success: true, message: "User is authenticated" })
})

module.exports = router

