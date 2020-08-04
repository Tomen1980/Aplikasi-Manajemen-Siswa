const express = require('express');
const path = require("path")
const app = express();
const fs = require("fs")
const port = process.env.PORT ;
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");
const multer = require("multer");
const helmet = require("helmet")
const compression = require('compression')
const morgan = require("morgan")

const sequelize = require("./utils/database");
const Timer = require("./middleware/Timeout");
const assessmentModel = require("./models/assessment/assessmentModel");
const studentModel = require("./models/student/studentModel");
const userModel = require("./models/user/userModel");
const routerHome = require("./router/home/homeRouter")
const routerStudent = require("./router/student/routerStudent")
const routerAssessment = require("./router/assessment/routerAssessment");
const routerLogin = require("./router/login/registerRouter");
const errorController = require("./controllers/404/errorController")
const routerReport = require("./router/report/reportRouter")
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images/student")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" 

    ){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const accesslog = fs.createWriteStream(path.join(__dirname,"accesslog.log"),{
    flags:"a"
})

app.use(helmet())
app.use(compression())
app.use(morgan("combined",{
    stream:accesslog
}))

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("Image"))
app.use("/images",express.static(path.join(__dirname,"images")));
app.use(
    session({
        secret:"my secret",
        resave:false,
        saveUninitialized:false,
        store: sequelize.sequelizeSessionStore,
        cookie:{maxAge: 1000*60*60}
    })
    )
app.set("view engine", "ejs");
app.set("views", "views");
const csrfProtection = csrf();
app.use(csrfProtection);
app.use(flash());
app.use(Timer);
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(routerHome);
app.use(routerStudent);
app.use(routerAssessment);
app.use(routerLogin);
app.use(routerReport);

app.use(errorController.errorController)
app.use(errorController.errorController500)
// app.use("/",(req,res,next)=>{
//     res.send("<h1>Hello world</h1>")
// })
app.use((error,req,res,next)=>{
    res.status(500).render("404/500",{
        pageTitle : "An Error Has Occurred",
             path : "/500"
    })
})

assessmentModel.belongsTo(studentModel,{foreignKey:"student_id",constraints:true,onDelete:"CASCADE"});
studentModel.hasMany(assessmentModel,{foreignKey:"student_id"});

sequelize.sequelize.sync()
    .then((result)=>{
       const server = app.listen(port)
       const io = require("./socket").init(server)
       io.on("connection",(socket)=>{
           console.log("Client connected")
       })
    })
    .catch((err)=>{
        console.log(err)
    })
