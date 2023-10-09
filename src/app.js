const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/registers"); //Collection Name
const Teacher = require("./models/teachers");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
// const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
// hbs.registerPartials(partials_path);

app.get("/", (req, res) =>{
    res.render("index")
});

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
        const cpassword = req.body.confirmpswd
        if (password === cpassword){
            const registerUser = Register ({
                email: req.body.email,
                RegistrationNumber: req.body.RegistrationNumber,
                pswd:password,
                confirmpswd: cpassword
            })
            const registered = await registerUser.save();
            res.status(201).render("Studentlogin");
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
        const cpassword = req.body.confirmpswd
        if (password === cpassword){
            const registerTeacher = Teacher ({
                email: req.body.email,
                RegistrationNumber: req.body.RegistrationNumber,
                pswd:password,
                confirmpswd: cpassword
            })
            const registered = await registerTeacher.save();
            res.status(201).render("Teacherlogin");
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
        if (userRegNo.pswd === pswd){
            res.status(201).render("StudentHomepage");
        }else{
            res.send("Invalid Login Credentials");
            // throw new Error("Invalid Login Credentials");
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
        if (teacherRegNo.pswd === pswd){
            res.status(201).render("TeacherHomepage");
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

app.get("/teacherHomepage", (req, res) =>{
    res.render("TeacherHomepage");
});

app.get("/", (req, res) =>{
    res.send("hello from the VITB Notes Portal")
});

app.listen(port, () => {
    console.log(`server is running at port ${port}`)
});

