const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },
    tokens : [{
        token : {
            type:String,
            required: true
        }
    }]
})

//generating tokens
userSchema.methods.generateAuthTokenTeacher = async function(){
    try{
        // console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.TEACHER_SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part " + error);
        // console.log("the error part " + error);
    }
}

userSchema.pre("save", async function(next){
    if (this.isModified("pswd")){
        // console.log(`the current password is ${this.pswd}`)
        this.pswd = await bcrypt.hash(this.pswd, 10);
        // console.log(`the current password is ${this.pswd}`)
        this.confirmpswd = await bcrypt.hash(this.pswd, 10);
    }
    next();
})

// now we have to create collections 

const Teacher = new mongoose.model("Teacher", userSchema);
module.exports = Teacher;