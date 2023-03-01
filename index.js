const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Connection } = require("mongoose");
const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

cloudinary.config({
    cloud_name: "creativem",
    api_key: "728829647533853",
    api_secret: "d7FOpvaEzC9D0XmKY_pGqzGTUm4",
});
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true, // this is the default

    })
);
// use cors to allow cross origin resource sharing from all domains
// app.use(cors(
//     {
//         // origin: "*",
//         origin: "https://adminpanel-189c0.web.app",
//         credentials: true,
//     }
// ));
app.use(cors({ origin: "https://adminpanel-189c0.web.app", credentials: true }));



//database connection
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://mjfood:1panzer00@cluster0.w54ra.mongodb.net/digitalMuDB?retryWrites=true&w=majority", {
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

