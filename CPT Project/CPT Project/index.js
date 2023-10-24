// app create
const express = require("express");
const app = express();

// muje port find karna h
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middleware add karna h
app.use(express.json());

// fileupload middleware for uploading files on server
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

// db se coonect karna h
const dbConnect = require("./config/database");
dbConnect();

// muje cloudinary se connect karna h
const cloudinaryConnect = require("./config/cloudinary");
cloudinaryConnect();

// muje api route mount karn h
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

// activate server 
app.listen(PORT,  () => {
    console.log(`App is running at ${PORT}`);
})