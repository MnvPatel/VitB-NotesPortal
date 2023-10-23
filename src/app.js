const dotenv = require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const authTeacher = require("./middleware/authTeacher");
const User = require('./models/registers');

const Register = require("./models/registers"); //Collection Name
const Teacher = require("./models/teachers");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
// const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
// hbs.registerPartials(partials_path);

app.get("/", (req, res) =>{
    res.render("index")
});

// // Route to display dynamic src images 

// app.get("/", (req, res) => { 
//     imageList = []; 
//     imageList.push({ src: "{{vitb.png}}", name: "vitb" });
//     res.render("index", { imageList: imageList }); 
// })

app.get("/registration", (req, res) =>{
    res.render("registration");
});

app.get("/StudentRegistration", (req, res) =>{
    res.render("StudentRegistration");
});

//create a new database
app.post("/StudentRegistration", async(req, res) =>{
    try{
        const password = req.body.pswd;
        const cpassword = req.body.confirmpswd;

        // Check if the email ends with "@vitbhopal.ac.in"
        const email = req.body.email;
        if (!email.endsWith("@vitbhopal.ac.in")) {
            res.send("Please use an email with the domain '@vitbhopal.ac.in'");
            return;
        }

        if (password === cpassword){
            const registerUser = Register ({
                name: req.body.name,
                email: req.body.email,
                RegistrationNumber: req.body.RegistrationNumber,
                branch: req.body.branch,
                DOB: req.body.DOB,
                gender: req.body.gender,
                pswd:password,
                confirmpswd: cpassword
            })
            // console.log("the success part " + registerUser);
            const token = await registerUser.generateAuthToken();
            // console.log("token part " + token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });

            const registered = await registerUser.save();
            // console.log("page part " + registered);
            res.status(201).redirect("Studentlogin");
        }else {
            res.send("Password does not match");
            // throw new Error("Password does not match");
        }
    } catch (error){
        res.status(400).send(error);
    }
})

app.get("/TeacherRegistration", (req, res) =>{
    res.render("TeacherRegistration");
});

app.post("/TeacherRegistration", async(req, res) =>{
    try{
        const password = req.body.pswd;
        const cpassword = req.body.confirmpswd;

        // Check if the email ends with "@vitbhopal.ac.in"
        const email = req.body.email;
        if (!email.endsWith("@vitbhopal.ac.in")) {
            res.send("Please use an email with the domain '@vitbhopal.ac.in'");
            return;
        }

        if (password === cpassword){
            const registerTeacher = Teacher ({
                name: req.body.name,
                email: req.body.email,
                RegistrationNumber: req.body.RegistrationNumber,
                designation: req.body.designation,
                DOB: req.body.DOB,
                gender: req.body.gender,
                pswd:password,
                confirmpswd: cpassword
            })
            console.log("the success part " + registerTeacher);
            const token = await registerTeacher.generateAuthTokenTeacher();
            console.log("token part " + token);
            
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });

            const registered = await registerTeacher.save();
            console.log("pxrt " + registered);
            res.status(201).redirect("Teacherlogin");
        }else {
            res.send("Password does not match");
            // throw new Error("Password does not match");
        }
    } catch (error){
        res.status(400).send(error);
    }
})

app.get("/login", (req, res) =>{
    res.render("login");
});

app.get("/Studentlogin", (req, res) =>{
    res.render("Studentlogin");
});

app.post("/Studentlogin", async(req, res) =>{
    try{
        const RegistrationNumber = req.body.RegistrationNumber;    //email
        const pswd = req.body.pswd;      
        const userRegNo = await Register.findOne({RegistrationNumber:RegistrationNumber});

        const isMatch = await bcrypt.compare(pswd, userRegNo.pswd);

        const token = await userRegNo.generateAuthToken();
        // console.log("token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        if (isMatch){
            res.status(201).redirect("StudentHomepage");
        }else{
            res.render("Studentlogin",{message: "Invalid Login Credentials"});
            // throw new Error("Invalid Login Credentials").redirect("Studentlogin");
        }
    } catch (error){
        res.status(400).send("Invalid Login Credentials");
        // throw new Error("Invalid Login Credentials");
    }
});

app.get("/Teacherlogin", (req, res) =>{
    res.render("Teacherlogin");
});

app.post("/Teacherlogin", async(req, res) =>{
    try{
        const RegistrationNumber = req.body.RegistrationNumber;   //email
        const pswd = req.body.pswd;
        const teacherRegNo = await Teacher.findOne({RegistrationNumber:RegistrationNumber});

        const teacherMatch = await bcrypt.compare(pswd, teacherRegNo.pswd);

        const token = await teacherRegNo.generateAuthTokenTeacher();
        // console.log("token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        if (teacherMatch){
            res.status(201).redirect("TeacherHomepage");
        }else{
            res.send("Invalid Login Credentials");
            // throw new Error("Invalid Login Credentials");
        }
    } catch (error){
        res.status(400).send("Invalid Login Credentials");
        // throw new Error("Invalid Login Credentials");
    }
});

app.post("/StudentHomepage", (req, res) =>{
    res.render("StudentHomepage");
});

app.get("/StudentHomepage", auth, (req, res) =>{
    res.render("StudentHomepage");
});

app.post("/Courses", (req, res) =>{
    res.render("Courses");
});

app.get("/Courses", auth, (req, res) =>{
    // console.log(`this is the cookie ${req.cookies.jwt}`);
    res.render("Courses");
});

app.get("/Logout", auth, async(req, res) =>{
    try {
        console.log(req.student);
        res.clearCookie("jwt");
        console.log("logout successfully");

        await req.student.save();
        res.redirect("/");

    } catch (error) {
        res.status(500).send(error);     
    }
});

app.get('/StudentProfile', auth, async (req, res) => {
    try {
      const user = await User.findById(req.student._id);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.render('StudentProfile', { user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/TeacherHomepage', authTeacher, async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.Teacher._id);
      if (!teacher) {
        return res.status(404).send('User not found');
      }
  
      res.redirect('TeacherHomepage', { teacher });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});


app.get("/", (req, res) =>{
    res.send("hello from the VITB Notes Portal")
});

app.listen(port, () => {
    console.log(`server is running at port ${port}`)
});

