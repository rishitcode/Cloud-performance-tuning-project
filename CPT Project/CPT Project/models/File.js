const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    },
});

// post middlware -----> This code will run after, entry is successfully created in database
fileSchema.post("save", async function(doc) {  // entery created in database is refered by doc
    try{    
        console.log("This is doc ---> ", doc);
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });
        let info = await transporter.sendMail({
            from:"Hitendra Demo",
            to:doc.email,
            subject:"New File Uploaded to cloudinary",
            html:`<h2>Hello Jeee File uploaded successfully </h2> <a href="${doc.imageUrl}">${doc.imageUrl}</a> </p>`,   
        })
        console.log("This is info object -----> ", info);
    }
    catch(error){
        console.error(error);
    }
})

// pre() and post() middleware is called always called before compiling schema into model
module.exports =mongoose.model("File", fileSchema);