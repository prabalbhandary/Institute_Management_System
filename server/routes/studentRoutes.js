import express from "express";
import {
  addNewStudent,
  getStudents,
  getStudent,
  getStudentwithCourse,
  updateStudent,
  deleteStudent,
  latestStudents,
} from "../controllers/studentControllers.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/add-student", checkAuth, addNewStudent);
router.get("/all-students", checkAuth, getStudents);
router.get("/student-details/:courseId", checkAuth, getStudentwithCourse);
router.get("/student-detail/:id", checkAuth, getStudent);
router.delete("/delete-student/:id", checkAuth, deleteStudent);
router.put("/update-student/:id", checkAuth, updateStudent);
router.get("/latest-students", checkAuth, latestStudents);

export default router;
