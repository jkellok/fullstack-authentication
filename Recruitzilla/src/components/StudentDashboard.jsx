import React, { useState, useEffect } from "react";
import { 
  Container, Tabs, Tab, Box, Typography, TextField, Paper, Grid, FormControl, InputLabel, 
  Select, MenuItem, Checkbox, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import CourseEnrollmentForm from "./CourseEnrollmentForm";
import CourseDetails from "./CourseDetails";
import StudentProfile from "./StudentProfile"; 
import { supabase } from "../supabaseClient";
import { useAuth } from "./context/AuthContext";

const sampleSchedule = [
  { day: "Monday", time: "10:00 - 11:30", course: "Mathematics 1", instructor: " Mikael", location: "Room 101" },
  { day: "Wednesday", time: "10:00 - 11:30", course: "Programming Language 1", instructor: "Esa Kunnari", location: "Room 202" },
  { day: "Friday", time: "10:00 - 11:30", course: "Programming Language 2", instructor: "Erkki", location: "Room 303" }
];

const skillsOptions = ["Device oriented programming","Networking","IoT","Backend","Frontend","General","Data Analysis"];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({ skills: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const { session } = useAuth();

  useEffect(() => {
    fetchAndSetCourses();
  }, []);

  useEffect(() => {
    fetchAndSetStudent();
  }, []);

  const fetchAndSetStudent = async () => {
    const { data, error } = await supabase
      .from("students")
      .select(
        "id, name, bio, nationality, phone_number, email, skills, languages, expected_graduation_year, user_id, list_of_courses(id, course_id, grade)"
      )
      .eq("user_id", session.user.id);
    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data);
    }
  };

  const fetchAndSetCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, unit_code, name, description, instructor_name, credits, category");

    if (error) {
      console.error("Error fetching courses:", error);
    } else {
      setCourses(data);
    }
  };

  const profileData = students[0] || {};
  const completedCourseIds = new Set((profileData.list_of_courses || []).map(course => course.course_id));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
  };

  const resetFilters = () => {
    console.log("Filters applied:", filters);
    setFilters({ skills: [] });
  };

 const handleEnroll = async (selectedCourses) => {
  try {
    // Insert each selected course into the list_of_courses table
    for (const course of selectedCourses) {
      const { error } = await supabase
        .from("list_of_courses")
        .insert({ student_id: profileData.id, course_id: course.id });

      if (error) {
        console.error("Error enrolling in course:", error);
      }
    }

    // Refetch student data to reflect new enrollments
    await fetchAndSetStudent();

    setEnrollOpen(false);
    console.log("Enrolled in courses:", selectedCourses);
  } catch (error) {
    console.error("Error enrolling in courses:", error);
  }
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

  const filteredCourses = courses
  .filter(course => !completedCourseIds.has(course.id))
  .filter(course => {
    const matchesSearchQuery = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategoryFilter = filters.skills.length === 0 || filters.skills.some(category => course.category.includes(category));
    return matchesSearchQuery && matchesCategoryFilter;
  });

  const courseMap = courses.reduce((map, course) => {
    map[course.id] = course;
    return map;
  }, {});

  const listOfCourses = profileData.list_of_courses || [];

  const gradedCourses = listOfCourses.map((course) => ({
    ...course,
    ...courseMap[course.course_id],
  }));

  const totalCredits = gradedCourses.reduce((acc, course) => acc + (course.credits || 0), 0);
  const totalGradePoints = gradedCourses.reduce((acc, course) => acc + (course.grade * (course.credits || 0)), 0);
  const averageGrade = totalCredits ? (totalGradePoints / totalCredits).toFixed(1) : 0;

  const updateProfile = async (updatedData) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({
          name: updatedData.name,
          bio: updatedData.bio,
          nationality: updatedData.nationality,
          phone_number: updatedData.phone_number,
          skills: updatedData.skills,
          languages: updatedData.languages,
          expected_graduation_year: updatedData.expected_graduation_year
        })
        .eq("user_id", session.user.id);
      
      if (error) {
        console.error("Error updating profile:", error);
      } else {
        fetchAndSetStudent(); 
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
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
              Filter by Category
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
              <Button variant="contained" color="primary" onClick={resetFilters} sx={{ backgroundColor: "#00B27B" }}>
                Reset Filters
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
                  <Typography variant="body2">Course Code: {course.unit_code}</Typography>
                  <Typography variant="body2">Category: {course.category}</Typography>
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
              <CourseEnrollmentForm courses={filteredCourses} onEnroll={handleEnroll} />
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
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#00B27B" }}>
            Grades
          </Typography>
          <Typography variant="body1">
            Average Grade: {averageGrade}
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell align="right">Grade</TableCell>
                  <TableCell align="right">Credits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gradedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell align="right">{course.grade}</TableCell>
                    <TableCell align="right">{course.credits}</TableCell>
                    <IconButton onClick={() => console.log("button")}>
                      <Edit />
                    </IconButton>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 3 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#00B27B" }}>
            Schedule
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
                {sampleSchedule.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.day}</TableCell>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>{entry.course}</TableCell>
                    <TableCell>{entry.instructor}</TableCell>
                    <TableCell>{entry.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default StudentDashboard;
