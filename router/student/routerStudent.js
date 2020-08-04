const express = require("express");
const router = express.Router();
const {check} = require("express-validator")
const Auth = require("../../middleware/Auth")
const studentControllers = require("../../controllers/student/studentController");

router.get("/student-list",Auth,studentControllers.getStudentList)

router.get("/student-list/add",Auth,studentControllers.getStudentAdd)

router.get("/student-list/:student",Auth,studentControllers.getStudentEdit)

router.post("/student-add",
            check("name").isLength({min:3}).withMessage("Fill in the data correctly"),
            check("classs").isLength({min:1}).withMessage("Fill in the data correctly"),
Auth,studentControllers.postStudentAdd)

router.post("/student-edit",Auth,studentControllers.postStudentEdit)

router.delete("/student-delete/:studentId",Auth,studentControllers.postStudentDelete)

module.exports = router;