const { date, object } = require("joi");
const mongoose = require("mongoose");


// DRIVER SCHEMA
const userSchema = new mongoose.Schema(
    {

        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        company: { type: String, required: true, trim: true },
        date: { type: Date, required: true, trim: true },
        status: { type: String, required: true, trim: true },
        img1: { type: String, required: true, trim: true },
        img2: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        digitalmuUrl: { type: String, trim: true, required: false },
        address: { type: String, required: true, trim: true },
        designation: { type: String, required: true, trim: true },
        selectedColor: { type: String, required: true, trim: true },
        facebookUrl: { type: String, trim: true, required: false },
        twitterUrl: { type: String, trim: true, required: false },
        tiktokUrl: { type: String, trim: true, required: false },
        youtubeUrl: { type: String, trim: true, required: false },
        taps: { type: Number, default: 0 },
        otherButtom: { type: Number, default: 0 },
        // create contacts array of objects with name, email, and phone default to empty array
        contacts: [{ name: String, email: String, phone: String },
        ],


    },

    { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
