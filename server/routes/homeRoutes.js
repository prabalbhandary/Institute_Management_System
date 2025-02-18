import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import { allData } from "../controllers/homeControllers.js";

const router = express.Router();

router.get("/all-data", checkAuth, allData);

export default router;
