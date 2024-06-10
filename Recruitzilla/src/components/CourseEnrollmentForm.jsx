import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Box,
  TextField,
} from "@mui/material";

const CourseEnrollmentForm = ({ courses, onEnroll }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleCourseChange = (event) => {
    const selectedValues = event.target.value;
    const newSelectedCourses = selectedValues.map((course) => {
      const existing = selectedCourses.find((c) => c.id === course.id);
      return existing ? existing : { ...course, grade: 1 };
    });
    setSelectedCourses(newSelectedCourses);
  };

  const handleGradeChange = (event, course) => {
    const newSelectedCourses = selectedCourses.map((c) =>
      c.id === course.id ? { ...c, grade: event.target.value } : c
    );
    setSelectedCourses(newSelectedCourses);
  };

  const handleEnroll = () => {
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
          renderValue={(selected) =>
            selected.map((course) => course.name).join(", ")
          }
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course}>
              <Checkbox
                checked={
                  selectedCourses.findIndex((c) => c.id === course.id) > -1
                }
              />
              <ListItemText primary={course.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedCourses.map((course) => (
        <Box key={course.id} display="flex" alignItems="center" mt={2}>
          <ListItemText primary={course.name} />
          <TextField
            label="Grade"
            type="number"
            value={course.grade}
            onChange={(e) => handleGradeChange(e, course)}
            inputProps={{ min: 1, max: 5 }}
            sx={{ width: 60, ml: 2 }}
          />
        </Box>
      ))}

      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEnroll}
          sx={{ backgroundColor: "#00B27B" }}
        >
          Enroll
        </Button>
      </Box>
    </Box>
  );
};

export default CourseEnrollmentForm;
