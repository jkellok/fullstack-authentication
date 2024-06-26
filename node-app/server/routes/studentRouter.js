import express from "express";
import { supabase } from "../supabaseClient.js";

const studentRouter = express.Router();

studentRouter.get("/students", async (req, res) => {
  try {
    // Fetch students
    const { data: students, error: studentError } = await supabase
      .from("students")
      .select();

    if (studentError) {
      return res.status(500).json({ error: studentError.message });
    }

    // Fetch list_of_courses
    const { data: listOfCourses, error: listOfCoursesError } = await supabase
      .from("list_of_courses")
      .select();

    if (listOfCoursesError) {
      return res.status(500).json({ error: listOfCoursesError.message });
    }

    // Map the list_of_courses to each student
    const studentsWithCourses = students.map((student) => {
      const studentCourses = listOfCourses.filter(
        (course) => course.student_id === student.id
      );
      return { ...student, list_of_courses: studentCourses };
    });

    res.send(studentsWithCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default studentRouter;
