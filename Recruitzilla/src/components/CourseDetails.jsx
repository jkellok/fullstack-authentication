import React from "react";
import { Typography, Box } from "@mui/material";

const CourseDetails = ({ course }) => {
  return (
    <Box>
      <Typography variant="h6">{course.name}</Typography>
      <Typography variant="body1">Instructor: {course.instructor_name}</Typography>
      <Typography variant="body2">Credits: {course.credits}</Typography>
      <Typography variant="body2">Course Code: {course.unit_code}</Typography>
      <Typography variant="body2">Description: {course.description}</Typography>
    </Box>
  );
};

export default CourseDetails;
