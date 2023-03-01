const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'password is required']
        },
        username: {
            type: String,
            required: true, unique: true
        },

    },
    { timestamps: true }
)
module.exports = mongoose.model("Admin", AdminSchema)
