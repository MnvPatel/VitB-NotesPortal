const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required: [true],
    },
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
    branch : {
        type:String,
        required: [true],
    },
    DOB : {
        type:String,
        required: [true],
        unique: [true],
    },
    gender : {
        type:String,
        required: [true],
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
userSchema.methods.generateAuthToken = async function(){
    try{
        // console.log(this._id);
        const token = jwt.sign({_id: this._id.toString()}, process.env.STUDENT_SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        // res.send("the error part " + error);
        throw new Error("Unable to generate the token");
        // console.log("the error part " + error);
    }
}

// userSchema.post("save", async function() {
//     try{
//       // console.log(this._id);
//       const token = jwt.sign({_id:this._id.toString()}, process.env.STUDENT_SECRET_KEY);
//       this.tokens = this.tokens.concat({token:token});
//       await this.save();
//       // return token;
//     } catch (error) {
//       res.send("the error part " + error);
//       // console.log("the error part " + error);
//     }
// })
  

userSchema.pre("save", async function(next){
    if (this.isModified("pswd")){
        // console.log(`the current password is ${this.pswd}`)
        this.pswd = await bcrypt.hash(this.pswd, 10);
        // console.log(`the current password is ${this.pswd}`)
        this.confirmpswd = await bcrypt.hash(this.confirmpswd, 10);
    }
    next();
})

// now we have to create collections 

const Register = new mongoose.model("Register", userSchema);
module.exports = Register;