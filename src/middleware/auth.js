const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyStudent = jwt.verify(token, process.env.STUDENT_SECRET_KEY);
        console.log(verifyStudent);

        const student = await Register.findOne({_id:verifyStudent._id});
        console.log(student);
        
        req.token = token;
        req.student = student;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;