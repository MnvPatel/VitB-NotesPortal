const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required: [true, "Please add the user Email Address"],
        unique: [true, "Email Address already taken"],
    },
    RegistrationNumber : {
        type:String,
        required: [true, "Please add the user Registration Number"],
        unique: [true, "Registration Number already exists"],
    },
    pswd : {
        type:String,
        required: [true, "Please add the user password"],
    },
    confirmpswd : {
        type:String,
        required: [true, "Please add the user password"],
    }
})

// now we have to create collections 

const Register = new mongoose.model("Register", userSchema);
module.exports = Register;