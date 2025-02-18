import express from "express";
import {
  addCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  latestCourses,
} from "../controllers/courseControllers.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/add-course", checkAuth, addCourse);
router.get("/all-courses", checkAuth, getCourses);
router.get("/course-details/:id", checkAuth, getCourse);
router.delete("/delete-course/:id", checkAuth, deleteCourse);
router.put("/update-course/:id", checkAuth, updateCourse);
router.get("/latest-courses", checkAuth, latestCourses);

export default router;
