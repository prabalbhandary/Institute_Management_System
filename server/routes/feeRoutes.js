const express = require("express");
const { addFee, feeHistory, studentFeeHistory } = require("../controllers/feeControllers");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.post("/add-fees", checkAuth, addFee);
router.get("/payment-history", checkAuth, feeHistory);
router.get("/all-payment", checkAuth, studentFeeHistory);

module.exports = router;
