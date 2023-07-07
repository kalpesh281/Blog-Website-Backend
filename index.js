const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require("multer")
const cors = require('cors')
const path = require('path')

dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cors(
    {
        origin:"*"
    }
))
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

},).then(console.log("connected to MongoDB")).catch((err) => console.log(err));

mongoose.connection.on('error', (err) => {
    if (err) throw err;
    console.log("DataBase Connected..")
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been Uploaded")
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)
app.listen("5000", () => {
    console.log("Backend is Runing..")
})