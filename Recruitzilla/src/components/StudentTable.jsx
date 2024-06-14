import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Typography, Box, Collapse, List, ListItem, ListItemText, Button } from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";

const StudentTable = ({ students, courses, onEditStudent, onDeleteStudent }) => {
  const [openRows, setOpenRows] = useState({});

  const handleRowClick = (studentId) => {
    setOpenRows((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : courseId;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Skills</TableCell>
            <TableCell>Graduation Year</TableCell>
            <TableCell>Average Grade</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => {
            const avgGrade = (
              student.list_of_courses.reduce((acc, curr) => acc + curr.grade, 0) /
              student.list_of_courses.length
            ).toFixed(1);
            return (
              <React.Fragment key={student.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(student.id)}
                    >
                      {openRows[student.id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.skills.join(", ")}</TableCell>
                  <TableCell>{student.expected_graduation_year}</TableCell>
                  <TableCell>{avgGrade}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEditStudent(student)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openRows[student.id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Courses
                        </Typography>
                        <List>
                          {student.list_of_courses.map((course) => (
                            <ListItem key={course.id}>
                              <ListItemText primary={getCourseName(course.id)} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
