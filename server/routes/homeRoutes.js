const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const {allData} = require("../controllers/homeControllers");

const router = express.Router();

router.get("/all-data", checkAuth, allData);

module.exports = router;