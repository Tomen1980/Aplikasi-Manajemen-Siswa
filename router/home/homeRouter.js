const express = require("express");
const router = express.Router();
const Auth = require("../../middleware/Auth")
const homeController = require("../../controllers/home/homeController");

router.get("/home",Auth,homeController.getIndex);

module.exports = router;