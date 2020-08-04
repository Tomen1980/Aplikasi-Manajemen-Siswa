const studentModel = require("../../models/student/studentModel");
// const Student = require("../../models/student/studentModel");
const {validationResult} = require("express-validator");
const deleteFile = require("../../utils/file");
const ITEM_PAGE = 2;
const io = require("../../socket")

exports.getStudentList=(req,res,next)=>{
    const page = +req.query.page || 1;
    const limit = (page * ITEM_PAGE) - 2;
    let totalItems;
    let message = req.flash("success")
    if(message.length > 0){
        message = message
    }else{
        message = null
    }
    studentModel.findAndCountAll()
        .then((numberStudent)=>{
            totalItems = numberStudent.count;
            return studentModel.findAll({
                limit : ITEM_PAGE,
                offset: limit,
                order : [
                    ["id","DESC"]
                ]
            })
        })   
    .then((rows)=>{
        res.render("./student/student-list.ejs",{
            pageTitle : "Student-list",
            path : "/student-list",
            student : rows,
            message : message,
            currentPage:page,
            hasNextPage: ITEM_PAGE*page < totalItems,
            hasPrevious: page > 1,
            nextPage : page + 1,
            PreviousPage:page - 1,
            lastPage : Math.ceil(totalItems/ITEM_PAGE)
        })
    }).catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        console.log(err)
        return next(err)
    })
}

exports.getStudentAdd=(req,res,next)=>{
    res.render("./student/student-add.ejs",{
        pageTitle:"Student add",
        path:"/student-list",
        edit : false,
        student : "",
        message : ""
    })
}

exports.postStudentAdd=(req,res,next)=>{
    const name = req.body.name;
    const classs = req.body.classs;
    const nik = req.body.nik;
    const Image = req.file;
    const gender = req.body.gender;
    const Address = req.body.Address;
    if(!Image){
        return res.status(422)
        .render("./student/student-add.ejs",{
            pageTitle:"Student add",
            path:"/student-list",
            edit : false,
            student : "",
            message: message.array()[0].msg
        })
    }
    let message = validationResult(req)
    if(!message.isEmpty()){
        return res.status(422)
        .render("./student/student-add.ejs",{
            pageTitle:"Student add",
            path:"/student-list",
            edit : false,
            student : "",
            message: message.array()[0].msg
        })
    }
    const imageUrl = Image.path
    studentModel.create({
        name    :name,
        classs  :classs,
        nik     :nik,
        Image   :imageUrl,
        gender  :gender,
        Address :Address,
    })
    .then((result)=>{
        // console.log(result)
        console.log("created student")
        io.getIo().emit("create",{action:"create",student : result})
        req.flash("success","Created Student")
        res.redirect("/student-list")
    })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        return next(err)
    })
}

exports.getStudentEdit=(req,res,next)=>{
    const Edit = req.query.edit
    if(!Edit){
        res.redirect("/")
    }
    const studentId = req.params.student
    studentModel.findByPk(studentId)
        .then((student)=>{
            res.render("student/student-add",{
                pageTitle:"Student add",
                path:"/student-list",
                student : student,
                edit : true,
                message : ""
            })
        })
        .catch((err)=>{ 
            const error = new Error(err)
            error.httpStatusCode=500
            return next(err)
        })
}

exports.postStudentEdit = (req,res,next)=>{
    const studentId = req.body.studentId
    const name = req.body.name
    const classs = req.body.classs
    const nik = req.body.nik
    const Image = req.file
    const gender = req.body.gender
    const Address = req.body.Address
    studentModel.findByPk(studentId)
    .then((students)=>{
        students.name = name;
        students.classs = classs;
        students.nik = nik;
        if(Image){
            deleteFile.deleteFile(students.Image)
            students.Image = Image.path;
        }
        students.gender = gender;
        students.Address = Address;
        return students.save();
    }).then((result)=>{
        console.log("Data Terupdate")
        res.redirect("/student-list")
    })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        return next(err)
    })
}

exports.postStudentDelete = async (req,res,next)=>{
    const studentId = req.params.studentId
    try{
        const students =await studentModel.findByPk(studentId)
        if(!students){
            return next(new Error("student not found"))
        }
        deleteFile.deleteFile(students.Image)
        students.destroy()
        res.status(200).json({
            message:"Destroyed"
        })
    }catch(err){
        const error = new Error(err)
        res.status(500).json({
            message:"Deleted Failed"
        })
    }
       
}