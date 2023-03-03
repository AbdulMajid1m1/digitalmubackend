const router = require("express").Router();
const User = require("../models/user");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const joi = require("joi");
const { sendEmail } = require("../mail");

cloudinary.config({
    cloud_name: "creativem",
    api_key: "728829647533853",
    api_secret: "d7FOpvaEzC9D0XmKY_pGqzGTUm4",
});
// get all products
router.get("/", async (req, res) => {
    res.send("Server is up and running");
});
router.get("/get-all-users", async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// send mail to user
router.post("/send-mail", async (req, res) => {
    const values = joi.object({
        email: joi.string().email().required(),
        userId: joi.string().required(),

    });
    const { error } = values.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, userId } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        sendEmail({
            from: user.email,
            to: "tanyaje.customer@gmail.com",
            subject: "Digital Mu Password Reset",
            html: ` <h3>${user.name} has requested Password Reset</h3> </b>, 
            <h4>phone: ${user.phone} </h4> </b>
            <h4>email: ${user.email} </h4> </b>`,
        });
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

});

router.get("/get-user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/delete-user/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        // check if user exists and deleted successfully
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// find user by email and phone
router.get("/find-user", async (req, res) => {
    const values = joi.object({
        email: joi.string().email().required(),
        phone: joi.string().required(),
    }).validate(req.query);
    if (values.error) {
        console.log(values.error.details[0].message);
        return res.status(400).json({ message: values.error.details[0].message });
    }
    const { email, phone } = req.query;
    try {
        const user = await User.findOne({ email, phone });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.post("/add-contact", async (req, res) => {
    const values = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().optional().allow(""),
        phone: joi.string().required(),
        userId: joi.string().required(),
    }).validate(req.body);
    if (values.error) {
        console.log(values.error.details[0].message);
        return res.status(400).json({ message: values.error.details[0].message });
    }
    const { name, email, phone, userId } = req.body;
    try {
        // add user to contacts array

        const UpdateUser = await User.findByIdAndUpdate(userId, { $push: { contacts: { name, email, phone } } }, { new: true });
        if (!UpdateUser) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Contact added successfully", UpdateUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/increment-taps", async (req, res) => {
    const values = joi.object({
        userId: joi.string().required(),
    }).validate(req.body);
    if (values.error) {
        console.log(values.error.details[0].message);
        return res.status(400).json({ message: values.error.details[0].message });
    }
    const { userId } = req.body;

    User.findByIdAndUpdate(userId, { $inc: { taps: 1 } }, { new: true }).exec()
        .then(user => {
            res.status(200).json({ message: "Taps incremented successfully", user });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: error.message });
        });

});

router.get("/get-all-contacts/:id", async (req, res) => {
    try {
        const userContacts = await User.findById(req.params.id);
        if (!userContacts) {
            return res.status(404).json({ message: "No contacts found" });
        }
        return res.status(200).json(userContacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post("/add-user", async (req, res) => {
    const values = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        company: joi.string().min(3).max(40).required(),
        // date: joi.date().required(),
        phone: joi.number().required(),
        address: joi.string().min(3).required(),
        digitalmuUrl: joi.string().optional().allow(""),
        designation: joi.string().required(),
        selectedColor: joi.string().required(),
        facebookUrl: joi.string().optional().allow(""),
        twitterUrl: joi.string().optional().allow(""),
        // it can be empty not required
        tiktokUrl: joi.string().optional().allow(""), // it can be empty not required
        // tiktokUrl: joi.string().optional(),
        // youtube url optional
        youtubeUrl: joi.string().optional().allow(""),
        // status should be either active or inactive case insensitive e.g. active or ACTIVE
        status: joi.string().valid("active", "inactive").insensitive().required(),
    }).validate(req.body);
    if (values.error) {
        console.log(values.error.details[0].message);
        return res.status(400).json({ message: values.error.details[0].message });
    }


    const { email, company, phone, address, digitalmuUrl, designation, selectedColor, facebookUrl, twitterUrl, tiktokUrl, youtubeUrl } = req.body;

    try {

        const img1 = await cloudinary.uploader.upload(req.files.img1.tempFilePath, {
            folder: "DigitalMu Panel",
        });
        const img2 = await cloudinary.uploader.upload(req.files.img2.tempFilePath, {
            folder: "DigitalMu Panel",
        });


        const user = new User({
            name: req.body.name,
            email,
            company,
            date: Date.now(),
            phone,
            address,
            img1: img1.secure_url,
            img2: img2.secure_url,
            digitalmuUrl,
            designation,
            selectedColor,
            facebookUrl,
            twitterUrl,
            tiktokUrl,
            youtubeUrl,
            status: req.body.status,

        });
        const saveUser = await user.save();
        res.send(saveUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }

});

router.put("/update-user/:id", async (req, res) => {
    try {
        const { id, name, email, company, phone, address, digitalmuUrl, designation, selectedColor, facebookUrl, twitterUrl, tiktokUrl, youtubeUrl, status } = req.body;

        const validationSchema = joi.object({
            id: joi.number(),
            name: joi.string().min(3).max(30),
            email: joi.string().email(),
            company: joi.string().min(3).max(40),
            // date: joi.date(),
            phone: joi.number(),
            address: joi.string().min(3),
            digitalmuUrl: joi.string().optional(),
            designation: joi.string(),
            selectedColor: joi.string(),
            facebookUrl: joi.string().optional(),
            twitterUrl: joi.string().optional(),
            tiktokUrl: joi.string().optional(),
            // youtube url optional
            youtubeUrl: joi.string().optional(),
            status: joi.string().valid('active', 'inactive').insensitive()
        });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // check if req has files img1 and img2
        if (req.files) {
            // upload image to cloudinary in folder "DigitalMu Panel"
            //  check if img1 is present
            if (req.files.img1) {
                const img1 = await cloudinary.uploader.upload(req.files.img1.tempFilePath, {
                    folder: "DigitalMu Panel",
                });
                req.body.img1 = img1.secure_url;
            }
            // check if img2 is present
            if (req.files.img2) {
                const img2 = await cloudinary.uploader.upload(req.files.img2.tempFilePath, {
                    folder: "DigitalMu Panel",
                });
                req.body.img2 = img2.secure_url;
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                id, name, email, company, phone, address,
                digitalmuUrl, designation, selectedColor, facebookUrl,
                twitterUrl, tiktokUrl, youtubeUrl, status,
                // if img1 is present in req.body then update img1 else don't update
                img1: req.body.img1 ? req.body.img1 : undefined,
                // if img2 is present in req.body then update img2 else don't update
                img2: req.body.img2 ? req.body.img2 : undefined,

            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


router.get("/get-user", async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/users/stat', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }

        const activeUsers = users.filter(user => user.status === "active");
        const inactiveUsers = users.filter(user => user.status === "inactive");

        return res.status(200).json({ 'activeUsers': activeUsers.length, 'inactiveUsers': inactiveUsers.length, 'totalUsers': users.length });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});



router.get("/users-analytics", async (req, res) => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last48Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const last72Hours = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    const last96Hours = new Date(now.getTime() - 96 * 60 * 60 * 1000);

    // fetch the users from the database and group them into three categories based on their createdAt timestamp
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
        } else {
            const group1 = users.filter(user => user.createdAt >= last24Hours);
            const group2 = users.filter(user => user.createdAt >= last48Hours && user.createdAt < last24Hours);
            const group3 = users.filter(user => user.createdAt >= last72Hours && user.createdAt < last48Hours);
            const group4 = users.filter(user => user.createdAt >= last96Hours && user.createdAt < last72Hours);
            console.log("group1", group1);
            console.log("group2", group2);
            console.log("group3", group3);
            res.json({
                last24Hours: group1.length,
                last48Hours: group2.length,
                last72Hours: group3.length,
                last96Hours: group4.length,
            });

        }
    });
});







module.exports = router;