import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const CourseTable = ({ courses, onEditCourse, onDeleteCourse }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Credits</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.instructor_name}</TableCell>
              <TableCell>{course.credits}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEditCourse(course)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDeleteCourse(course.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseTable;
