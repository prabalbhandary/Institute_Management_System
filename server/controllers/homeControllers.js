const jwt = require("jsonwebtoken");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Fee = require("../models/feeModel");
const allData = async(req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const newFees = await Fee.find({uid: verify.uid}).sort({createdAt: -1}).limit(5)
        const newStudents = await Student.find({uid: verify.uid}).sort({createdAt: -1}).limit(5)
        const totalCourse = await Course.countDocuments({uid: verify.uid})
        const totalStudent = await Student.countDocuments({uid: verify.uid})
        const totalAmount = await Fee.aggregate([
            {
                $match: {uid: verify.uid}
            },
            {
                $group: {_id: null, total: {$sum: "$amount"}}
            }
        ])
        return res.status(200).json({
            success: true,
            message: "Home details fetched successfully",
            fees: newFees,
            students: newStudents,
            totalCourse: totalCourse,
            totalStudent: totalStudent,
            totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
        })
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    allData
}