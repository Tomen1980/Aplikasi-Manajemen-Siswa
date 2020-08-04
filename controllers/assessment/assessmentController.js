const {validationResult} = require("express-validator")
const assessmentModel = require("../../models/assessment/assessmentModel")
const studentModel = require("../../models/student/studentModel")
const Assessment = require("../../models/assessment/assessmentModel")
const io = require("../../socket")
const ITEM_PAGE = 2;


exports.getAssessment = (req,res,next)=>{
    const page = +req.query.page || 1;
    const limit = (page*ITEM_PAGE)-2;
    let totalItems
    let message = req.flash("success")
    if(message.length){
        message = message
    }else{
        message = null
    }
    assessmentModel.findAndCountAll()
        .then((numberAssessment)=>{
            totalItems = numberAssessment.count
            return assessmentModel.findAll({
                include:[{
                    model:studentModel,
                    attributes:["name","classs","nik","gender","Address","Image"]
                }],
                order:[
                    ["id","DESC"]
                ],
                limit:ITEM_PAGE,
                offset:limit
            })
            .then((rows)=>{
                console.log(rows)
                res.render("assessment/index",{
                    pageTitle : "Assessment",
                    path : "/assessment",
                    assessment : rows,
                    message : message,
                    currentPage:page,
                    hasNextPage: ITEM_PAGE*page < totalItems,
                    hasPrevious: page > 1,
                    nextPage : page + 1,
                    PreviousPage:page - 1,
                    lastPage : Math.ceil(totalItems/ITEM_PAGE)
                })
            })
        })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        console.log(err)
        return next(err)
    })

}

exports.getAssessmentAdd = (req,res,next)=>{
    studentModel.findAll()
    .then((rows)=>{
        // console.log(rows)
        res.render("assessment/assessment-add",{
            pageTitle : "Assessment add",
            path : "/assessment",
            edit : false,
            asessment:"",
            student : rows,
            message : ""
        })
    })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        return next(err)
    })
}

exports.getAssessmentEdit=(req,res,next)=>{
    const Edit = req.query.edit
    if(!Edit){
        return res.redirect("/assessment")
    }
    const assessmentId = req.params.id;
    assessmentModel.findByPk(assessmentId,{
        include:[{
            model:studentModel,
            attributes:["id","name","classs","nik","gender","Address","Image"]
        }]
    })
    .then((rows)=>{
       return rows
    }).then(rows=>{
        //    console.log(rows)
           studentModel.findAll()
            .then((result)=>{
                res.render("assessment/assessment-add",{
                    pageTitle : "Assessment add",
                    path : "/assessment",
                    asessment : rows,
                    student : result,
                    edit : true,
                    message : ""
                })
            })
       })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        return next(err)
    })
}

exports.postAssessmentAdd= async (req,res,next)=>{
    const student_id = req.body.student_id
    const score = req.body.score
    const message = validationResult(req)
    if(!message.isEmpty()){
        const rows = await studentModel.findAll()
        return res.status(422)
            .render("assessment/assessment-add",{
            pageTitle : "Assessment add",
            path : "/assessment",
            edit : false,
            asessment:"",
            student : rows,
            message : message.array()[0].msg
        })
    }
    assessmentModel.create({
        student_id : student_id,
        score : score
    })
    .then((result)=>{
        req.flash("success","Success Created")
        assessmentModel.findByPk(result.id,{
            include:[{
                model:studentModel,
                attributes:["id","name","nik","classs","gender","Address","Image"]
            }]
        })
        .then((assessment)=>{
            io.getIo().emit("assessment",{action:"create",assessment:assessment})
        })
        res.redirect("/assessment")
    })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        return next(err)
    })
}

exports.postAssessmentEdit= async(req,res,next)=>{
    const id = req.body.id
    const student_id = req.body.student_id
    const score = req.body.score
    let message = validationResult(req)
    if(!message.isEmpty()){
        const rows = await studentModel.findAll()
        const assessment = await assessmentModel.findByPk(id,{
            include:[{
                model:studentModel,
                attributes:["id","name","nik","classs","gender","Address","Image"]
            }]
        })
        return res.status(422)
            .render("assessment/assessment-add",{
                pageTitle : "Assessment Edit",
                path : "/assessment",
                student : rows,
                asessment : assessment,
                edit : true,
                message : message.array()[0].msg
            })
    }
    assessmentModel.findByPk(id)
    .then((assessment)=>{
        assessment.student_id=student_id
        assessment.score=score
        return assessment.save()
    })
    .then((result)=>{
        console.log("Updated")
        req.flash("success","Updated Assessment")
        res.redirect("/assessment")
    })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        return next(err)
    })
}

exports.postAssessmentDelete=async(req,res,next)=>{
    const assessmentId = await req.body.assessmentId
    const assessment = await assessmentModel.findByPk(assessmentId)
    .then((assessments)=>{
        return assessments.destroy()
    })
    .then((result)=>{
        console.log("Destroyer")
        req.flash("success","Assessement Destroyer")
        res.redirect("/assessment")
    })
    .catch((err)=>{
        const error = new Error(err)
        error.httpStatusCode=500
        return next(err)
    })
}