const express = require("express");
const {check}    = require("express-validator")
const router = express.Router();
const Auth = require("../../middleware/Auth")
const assessmentController = require("../../controllers/assessment/assessmentController");

router.get("/assessment",Auth,assessmentController.getAssessment);
router.get("/assessment/add",Auth,assessmentController.getAssessmentAdd);
router.get("/assessment-edit/:id",Auth,assessmentController.getAssessmentEdit);
router.post("/assessment-add",
            check("score").isLength({min:1}).withMessage("Value Score min 1 character"),
            Auth,assessmentController.postAssessmentAdd);
router.post("/assessment-edit",
            check("score").isLength({min:1}).isNumeric().withMessage("Value Score min 1 character"),
Auth,assessmentController.postAssessmentEdit);
router.post("/assessment-delete",Auth,assessmentController.postAssessmentDelete);

module.exports = router;