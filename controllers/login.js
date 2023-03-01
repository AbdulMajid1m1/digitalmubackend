const jwt = require('jsonwebtoken')
const Joi = require('joi')
const jwtKey = 'hellobirds';
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10);
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
// const User = require('../Models/User');

const SignUp = async (req, res, next) => {
    const value = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required(),
        username: Joi.string().required()
    }).validate(req.body)
    if (value.error) {
        return res.status(400).json({ success: false, message: value.error.details[0].message })
    }
    try {
        const { email, password, username } = req.body
        const user = await Admin.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists!" })
        }

        else {
            // create a new chatlist for the user


            const hash = bcrypt.hashSync(password, salt);
            const newUser = new Admin({
                email: email.toLowerCase(),
                password: hash,
                username,

            })
            console.log(newUser)

            const userTokenData = newUser;
            delete userTokenData.password;
            const token = jwt.sign({ userData: userTokenData }, jwtKey, { expiresIn: '60d' })
            const createdUser = await newUser.save()
            delete createdUser.password
            // const token = jwt.sign({ id: createdUser._id }, jwtKey, { expiresIn: '1d' })

            return res.cookie("accessToken", token, {
                httpOnly: true,
            }).status(200).json({ success: true, userData: createdUser, token: token })

        }

    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}


const SignIn = async (req, res, next) => {
    const value = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required()
    }).validate(req.body)
    if (value.error) {
        return res.status(400).json({ success: false, message: value.error.details[0].message })
    }
    try {
        const { email, password } = req.body
        const user = await Admin.findOne({
            email: email.toLowerCase()
        })
        if (user) {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if (isPasswordCorrect) {
                const userData = user.toObject();
                delete userData.password;
                const token = jwt.sign(userData, jwtKey, { expiresIn: '30d' })
                res.cookie("accessToken", token, {
                    httpOnly: true,
                }).status(200).json({
                    success: true, message: "Login Successful",
                    userData: user,
                    token
                })
            }
            else {
                return res.status(400).json({ success: false, message: "Wrong credentials!" })
            }

        }
        else {
            return res.status(400).json({ success: false, message: "Wrong credentials!" })
        }

    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Something went wrong!" })

    }
}


const logout = async (req, res, next) => {
    res
        .clearCookie("adminToken", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .send("User has been logged out.");
};







module.exports = {
    SignUp,
    SignIn,
    logout
}
