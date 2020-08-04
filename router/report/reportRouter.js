const express = require("express");
const router = express.Router();
const Auth = require("../../middleware/Auth")
const reportController = require("../../controllers/report/reportController");

router.get("/report",Auth,reportController.getReport);

module.exports = router;