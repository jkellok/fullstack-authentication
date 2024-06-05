import React from "react";
import { Typography, Box } from "@mui/material";

const CourseDetails = ({ course }) => {
  return (
    <Box>
      <Typography variant="h6">{course.name}</Typography>
      <Typography variant="body2">Credits: {course.credits}</Typography>
      <Typography variant="body2">Course Code: {course.courseCode}</Typography>
      <Typography variant="body2">Duration: {course.duration}</Typography>
      <Typography variant="body2">Skills: {course.skills.join(", ")}</Typography>
    </Box>
  );
};

export default CourseDetails;
