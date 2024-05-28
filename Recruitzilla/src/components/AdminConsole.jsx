import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Button, Typography, Tabs, Tab, Box, TextField } from "@mui/material";
import UserTable from "./UserTable";
import StudentTable from "./StudentTable";
import CourseTable from "./CourseTable";
import UserDialog from "./UserDialog";
import CourseDialog from "./CourseDialog";
import FilterPanel from "./FilterPanel";
import usersData from "../assets/users.json"; // Sample JSON data for users for testing, will be deleted
import studentsData from "../assets/students_final.json";
import coursesData from "../assets/courses_final.json";

const AdminConsole = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [courseSearchQuery, setCourseSearchQuery] = useState("");

  useEffect(() => {
    setUsers(usersData);
    setStudents(studentsData);
    setCourses(coursesData);
    setFilteredUsers(usersData);
    setFilteredStudents(studentsData);
    setFilteredCourses(coursesData);
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenUserDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleSaveUser = (user) => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setFilteredUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      const newUser = { ...user, id: users.length + 1 };
      setUsers([...users, newUser]);
      setFilteredUsers([...users, newUser]);
    }
    setOpenUserDialog(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    setFilteredUsers(users.filter((user) => user.id !== userId));
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setOpenCourseDialog(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  const handleSaveCourse = (course) => {
    if (selectedCourse) {
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
      setFilteredCourses(courses.map((c) => (c.id === course.id ? course : c)));
    } else {
      const newCourse = { ...course, id: courses.length + 1 };
      setCourses([...courses, newCourse]);
      setFilteredCourses([...courses, newCourse]);
    }
    setOpenCourseDialog(false);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
    setFilteredCourses(courses.filter((course) => course.id !== courseId));
  };

  const handleFilterChange = (filters) => {
    setFilteredStudents(
      students.filter((student) => {
        const avgGrade = student.list_of_courses.reduce((acc, curr) => acc + curr.grade, 0) / student.list_of_courses.length;
        return (
          (!filters.skills.length || filters.skills.some(skill => student.skills.includes(skill))) &&
          (!filters.courses.length || filters.courses.some(course => student.list_of_courses.some(c => courses.find(cr => cr.name === course && cr.id === c.id)))) &&
          (!filters.gradYears.length || filters.gradYears.includes(student.expected_graduate_year)) &&
          (!filters.grades.length || filters.grades.includes(Math.round(avgGrade)))
        );
      })
    );
  };

  const handleEditStudent = (student) => {
    setSelectedUser(student);
    setOpenUserDialog(true);
  };

  const handleDeleteStudent = (studentId) => {
    setStudents(students.filter((student) => student.id !== studentId));
    setFilteredStudents(filteredStudents.filter((student) => student.id !== studentId));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserSearchChange = (event) => {
    setUserSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) =>
        user.name.toLowerCase().includes(event.target.value.toLowerCase())
      ));
    }
  };

  const handleStudentSearchChange = (event) => {
    setStudentSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter((student) =>
        student.name.toLowerCase().includes(event.target.value.toLowerCase())
      ));
    }
  };

  const handleCourseSearchChange = (event) => {
    setCourseSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter((course) =>
        course.name.toLowerCase().includes(event.target.value.toLowerCase())
      ));
    }
  };

  return (
    <Container style={{ marginTop: "50px"}}>
      <Paper style={{ padding: "40px", margin: '50px 50px 0 50px' }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Users" />
          <Tab label="Students" />
          <Tab label="Courses" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Search Users"
                variant="outlined"
                fullWidth
                value={userSearchQuery}
                onChange={handleUserSearchChange}
                style={{ marginBottom: "20px" }}
              />
              <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black hover:bg-[#00B27B] text-bold hover:bg-[#00B27B]"
              onClick={handleAddUser}>
                Add User
              </button>
              <UserTable users={filteredUsers} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FilterPanel onFilterChange={handleFilterChange} courses={courses} />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Search Students"
                variant="outlined"
                fullWidth
                value={studentSearchQuery}
                onChange={handleStudentSearchChange}
                style={{ marginBottom: "20px" }}
              />
              <StudentTable students={filteredStudents} courses={courses} onEditStudent={handleEditStudent} onDeleteStudent={handleDeleteStudent} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Search Courses"
                variant="outlined"
                fullWidth
                value={courseSearchQuery}
                onChange={handleCourseSearchChange}
                style={{ marginBottom: "20px" }}
              />
              <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black hover:bg-[#00B27B] text-bold hover:bg-[#00B27B]"
               onClick={handleAddCourse}>
                Add Course
              </button>
              <CourseTable courses={filteredCourses} onEditCourse={handleEditCourse} onDeleteCourse={handleDeleteCourse} />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      <UserDialog open={openUserDialog} user={selectedUser} courses={courses} onClose={() => setOpenUserDialog(false)} onSave={handleSaveUser} />
      <CourseDialog open={openCourseDialog} course={selectedCourse} onClose={() => setOpenCourseDialog(false)} onSave={handleSaveCourse} />
    </Container>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default AdminConsole;
