const {Student, Course, StudentCourses} = require('../models')

//view all
module.exports.viewAll = async function (req, res) {
    const students = await Student.findAll();
    res.render('student/view_all', {students});
}

//profile
module.exports.viewProfile = async function (req, res) {
    const student = await Student.findByPk(req.params.id, {
        include: 'courses'
    });
    const courses = await Course.findAll();
    let availableCourses = [];
    for (let i = 0; i < courses.length; i++) {
        if (!studentHasCourse(student, courses[i])) {
            availableCourses.push(courses[i]);
        }
    }
    res.render('student/profile', {student, availableCourses})
}

//render add
module.exports.renderAddForm = function (req, res) {
    const student = {
        first_name: '',
        last_name: '',
        grade_level: 9,
    }
    res.render('student/add', {student});
}

//add
module.exports.addStudent = async function (req, res) {
    const student = await Student.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        grade_level: req.body.grade_level
    });
    res.redirect(`/students/profile/${student.id}`);
}

//render edit
module.exports.renderEditForm = async function (req, res) {
    const student = await Student.findByPk(req.params.id);
    console.log(student);
    res.render('student/edit', {student});
}

//update
module.exports.updateStudent = async function (req, res) {
    const student = await Student.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        grade_level: req.body.grade_level,

    }, {
        where: {
            id: req.params.id
        }
    });
    res.redirect(`/students/profile/${req.params.id}`);
}

//delete
module.exports.deleteStudent = async function (req, res) {
    await Student.destroy({
        where: {
            id: req.params.id
        }
    });
    res.redirect('/students');
}

//Add course to student
module.exports.enrollStudent = async function (req, res) {

        await StudentCourses.create({
            student_id: req.params.studentId,
            course_id: req.body.course
        })
        res.redirect(`/students/profile/${req.params.studentId}`);

}

//delete course from student
module.exports.removeCourse = async function(req, res){
    await StudentCourses.destroy({
        where: {
            student_id: req.params.studentId,
            course_id: req.params.courseId
        }
    });
    res.redirect(`/students/profile/${req.params.studentId}`)
}

function studentHasCourse(student, course) {
    for (let i = 0; i < student.courses.length; i++) {
        if (course.id === student.courses[i].id) {
            return true
        }
    }
    return false
}

