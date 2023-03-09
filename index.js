const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Connection } = require("mongoose");
const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

cloudinary.config({
    cloud_name: "du27h3lsu",
    api_key: "323936629766162",
    api_secret: "CgNCVe7iVnnA6DUk5LjjKI4S5fM",
});
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true, // this is the default

    })
);

app.use(cors({
    origin: ["https://adminpanel-189c0.web.app", "http://localhost:3000"], credentials: true
}));



//database connection
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://tanyajemarketing:wft92fWwtA9eRcIX@cluster0.27g991n.mongodb.net/?retryWrites=true&w=majority", {

    useNewUrlParser: true,
}).then(() => {
    console.log("Connected to database!");
}).catch((e) => {
    console.log(e);
});


app.use(bodyParser.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", require("./routes/Route"));
app.use("/", require("./routes/Login"));


const port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log(`Server has started on ${port}`);
});

