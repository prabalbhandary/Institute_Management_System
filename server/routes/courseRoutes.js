const express = require("express");
const {
  addCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  latestCourses
} = require("../controllers/courseControllers");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.post("/add-course", checkAuth, addCourse);
router.get("/all-courses", checkAuth, getCourses);
router.get("/course-details/:id", checkAuth, getCourse);
router.delete("/delete-course/:id", checkAuth, deleteCourse);
router.put("/update-course/:id", checkAuth, updateCourse);
router.get("/latest-courses", checkAuth, latestCourses);

module.exports = router;
