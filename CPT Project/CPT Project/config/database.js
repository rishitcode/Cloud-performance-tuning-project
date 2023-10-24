const mongoose = require("mongoose");
require("dotenv").config();

function dbConnect(){
    mongoose.connect(process.env.MONGODB_URL ,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(() => {console.log("DB Connection successful")})
    .catch((error) =>{
        console.log("DB Connection Failed")
        console.log(error);
        process.exit(1);
    });
}

module.exports = dbConnect;