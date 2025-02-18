import express from "express";
import {
  addFee,
  feeHistory,
  studentFeeHistory,
} from "../controllers/feeControllers.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/add-fees", checkAuth, addFee);
router.get("/payment-history", checkAuth, feeHistory);
router.get("/all-payment", checkAuth, studentFeeHistory);

export default router;
