const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
