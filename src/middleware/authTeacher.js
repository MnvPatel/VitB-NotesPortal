const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teachers");

const authTeacher = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyTeacher = jwt.verify(token, process.env.Teacher_SECRET_KEY);
        console.log(verifyTeacher);

        const Teacher = await Register.findOne({_id:verifyTeacher._id});
        console.log(Teacher);
        
        req.token = token;
        req.Teacher = Teacher;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = authTeacher;