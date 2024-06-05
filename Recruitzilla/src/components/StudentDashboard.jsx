import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Box, Typography, TextField, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CourseEnrollmentForm from "./CourseEnrollmentForm";
import CourseDetails from "./CourseDetails";
import StudentProfile from "./StudentProfile"; 
import { supabase } from "../supabaseClient";

const predefinedCourses = [
  { id: 1, name: "Mathematics 1", credits: 5, courseCode: "MATH101", duration: "6 weeks", skills: ["Math"] },
  { id: 2, name: "Mathematics 2", credits: 5, courseCode: "MATH102", duration: "6 weeks", skills: ["Math"] },
  { id: 3, name: "Orientation for English", credits: 3, courseCode: "ENG101", duration: "4 weeks", skills: ["English"] },
  { id: 4, name: "Electromagnetism, Waves and Atomic Physics", credits: 4, courseCode: "PHYS201", duration: "8 weeks", skills: ["Physics,Math"] },
  { id: 5, name: "Physics Laboratory Works", credits: 2, courseCode: "PHYS202", duration: "4 weeks", skills: ["Physics,Science"] },
  { id: 6, name: "Programming Language 1", credits: 3, courseCode: "PL101", duration: "4 weeks", skills: ["C++"] },
  { id: 7, name: "Programming Language 2", credits: 5, courseCode: "PL202", duration: "8 weeks", skills: ["Java"] }
];

const sampleSchedule = [
  { day: "Monday", time: "10:00 - 11:30", course: "Mathematics 1", instructor: " Mikael", location: "Room 101" },
  { day: "Wednesday", time: "10:00 - 11:30", course: "Programming Lnaguage 1", instructor: "Esa kunnari", location: "Room 202" },
  { day: "Friday", time: "10:00 - 11:30", course: "Programming Lnaguage 2", instructor: "Erkki", location: "Room 303" }
];

const skillsOptions = ["Java", "NodeJS", "Python", "C++", "AWS", "React"];

const StudentDashboard = ({ students, courses, schedule, notifications }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({ skills: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const profileData = students[0] || {};

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
  };

  const applyFilters = () => {
    console.log("Filters applied:", filters);
    // Implement filter logic here
  };

  const handleEnroll = (selectedCourses) => {
    setEnrolledCourses(selectedCourses);
    console.log("Enrolled in courses:", selectedCourses);
    setEnrollOpen(false);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseCourseDetails = () => {
    setSelectedCourse(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourses = predefinedCourses.filter(course => {
    const matchesSearchQuery = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkillsFilter = filters.skills.length === 0 || filters.skills.some(skill => course.skills.includes(skill));
    return matchesSearchQuery && matchesSkillsFilter;
  });

  const totalCredits = enrolledCourses.reduce((acc, course) => acc + course.credits, 0);
  const totalGradePoints = enrolledCourses.reduce((acc, course) => acc + (course.grade * course.credits), 0);
  const averageGrade = (totalGradePoints / totalCredits).toFixed(1);

  const updateProfile = (updatedData) => {
    console.log("Profile updated:", updatedData);
    // Implement the profile update logic here
  };

  return (
    <Container>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Profile" />
        <Tab label="Courses" />
        <Tab label="Grades" />
        <Tab label="Schedule" />
      </Tabs>

      {activeTab === 0 && (
        <StudentProfile profileData={profileData} updateProfile={updateProfile} />
      )}

      {activeTab === 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#00B27B" }}>
            Courses
          </Typography>
          <TextField
            label="Search Courses"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Filter by Skills
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Skills</InputLabel>
              <Select
                multiple
                value={filters.skills}
                onChange={(e) => handleFilterChange({ ...filters, skills: e.target.value })}
                renderValue={(selected) => selected.join(", ")}
              >
                {skillsOptions.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox checked={filters.skills.indexOf(skill) > -1} />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button variant="contained" color="primary" onClick={applyFilters} sx={{ backgroundColor: "#00B27B" }}>
                Apply Filters
              </Button>
            </Box>
          </Paper>
          <Typography variant="h6" gutterBottom>
            Course List
          </Typography>
          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setEnrollOpen(true)} sx={{ backgroundColor: "#00B27B" }}>
              Enroll in Courses
            </Button>
          </Box>
          <Grid container spacing={2}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">{course.name}</Typography>
                  <Typography variant="body2">Credits: {course.credits}</Typography>
                  <Typography variant="body2">Course Code: {course.courseCode}</Typography>
                  <Typography variant="body2">Duration: {course.duration}</Typography>
                  <Button variant="outlined" color="primary" onClick={() => handleCourseClick(course)} sx={{ mt: 1 }}>
                    View Details
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Dialog open={enrollOpen} onClose={() => setEnrollOpen(false)} fullWidth>
            <DialogTitle>Enroll in Courses</DialogTitle>
            <DialogContent>
              <CourseEnrollmentForm courses={predefinedCourses} onEnroll={handleEnroll} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEnrollOpen(false)} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={!!selectedCourse} onClose={handleCloseCourseDetails} fullWidth>
            <DialogTitle>Course Details</DialogTitle>
            <DialogContent>
              {selectedCourse && <CourseDetails course={selectedCourse} />}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCourseDetails} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          {enrolledCourses.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Enrolled Courses
              </Typography>
              <Grid container spacing={2}>
                {enrolledCourses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                      <Typography variant="h6">{course.name}</Typography>
                      <Typography variant="body2">Credits: {course.credits}</Typography>
                      <Typography variant="body2">Course Code: {course.courseCode}</Typography>
                      <Typography variant="body2">Duration: {course.duration}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ mt: 4, padding: "20px" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#00B27B" }}>
            Grades
          </Typography>
          <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
            <Typography variant="h6">Grade: {averageGrade}</Typography>
            <Typography variant="h6" gutterBottom>Courses Completed:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={2}><Typography variant="body1"><strong>Credits</strong></Typography></Grid>
              <Grid item xs={6}><Typography variant="body1"><strong>Course</strong></Typography></Grid>
              <Grid item xs={2}><Typography variant="body1"><strong>Grade</strong></Typography></Grid>
            </Grid>
            {enrolledCourses.map(course => (
              <Grid container spacing={2} key={course.id}>
                <Grid item xs={2}><Typography variant="body2">{course.credits}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">{course.name}</Typography></Grid>
                <Grid item xs={2}><Typography variant="body2">{course.grade}</Typography></Grid>
              </Grid>
            ))}
          </Paper>
        </Box>
      )}

      {activeTab === 3 && (
        <Container sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Class Schedule
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleSchedule.map((classItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{classItem.day}</TableCell>
                    <TableCell>{classItem.time}</TableCell>
                    <TableCell>{classItem.course}</TableCell>
                    <TableCell>{classItem.instructor}</TableCell>
                    <TableCell>{classItem.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}
    </Container>
  );
};

export default StudentDashboard;
