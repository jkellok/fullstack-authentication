import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Button, Box } from "@mui/material";

const CourseEnrollmentForm = ({ courses, onEnroll }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleCourseChange = (event) => {
    setSelectedCourses(event.target.value);
  };

  const handleEnroll = () => {
    console.log("Selected courses for enrollment:", selectedCourses); // Debug log
    onEnroll(selectedCourses);
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Courses</InputLabel>
        <Select
          multiple
          value={selectedCourses}
          onChange={handleCourseChange}
          renderValue={(selected) => selected.map(course => course.name).join(", ")}
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course}>
              <Checkbox checked={selectedCourses.indexOf(course) > -1} />
              <ListItemText primary={course.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ textAlign: 'right', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleEnroll} sx={{ backgroundColor: "#00B27B" }}>
          Enroll
        </Button>
      </Box>
    </Box>
  );
};

export default CourseEnrollmentForm;
