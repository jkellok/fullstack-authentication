import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
} from "@mui/material";
import UserTable from "./UserTable";
import StudentTable from "./StudentTable";
import CourseTable from "./CourseTable";
import UserDialog from "./UserDialog";
import CourseDialog from "./CourseDialog";
import FilterPanel from "./FilterPanel";
import { supabase } from "../supabaseClient";

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
    fetchAndSetStudents();
  }, []);

  useEffect(() => {
    fetchAndSetUsers();
  }, []);

  useEffect(() => {
    fetchAndSetCourses();
  }, []);

  const fetchAndSetStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select(
        "id, name, email, skills, expected_graduation_year, list_of_courses(id, course_id, grade)"
      );

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      const formattedStudents = data.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        skills: student.skills,
        expected_graduation_year: student.expected_graduation_year,
        list_of_courses: student.list_of_courses.map((course) => ({
          id: course.course_id,
          grade: course.grade,
        })),
      }));
      setStudents(formattedStudents);
      setFilteredStudents(formattedStudents);
    }
  };

  const fetchAndSetUsers = async () => {
    const { data, error } = await supabase
      .from("new_users")
      .select("id, name, email, role_name");

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      const formattedUsers = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      }));
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    }
  };

  const fetchAndSetCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, name, instructor_name, credits");

    if (error) {
      console.error("Error fetching courses:", error);
    } else {
      const formattedCourses = data.map((course) => ({
        id: course.id,
        name: course.name,
        instructor_name: course.instructor_name,
        credits: course.credits,
      }));
      setCourses(formattedCourses);
      setFilteredCourses(formattedCourses);
    }
  };

 
  const handleEditUser = (user) => {
    console.log("Editing user:", user);
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleSaveUser = async (user) => {
    console.log("Saving user:", user);

    if (selectedUser) {
      if (!user.id) {
        console.error("Error: User ID is undefined");
        return;
      }

      const { error: updateError } = await supabase
        .from("new_users")
        .update({
          name: user.name,
          email: user.email,
          role_name: user.role,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user:", updateError);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("new_users")
        .insert([{ name: user.name, email: user.email, role_name: user.role }]);

      if (insertError) {
        console.error("Error adding user:", insertError);
        return;
      }
    }

    await fetchAndSetUsers();
    setOpenUserDialog(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from("new_users")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Error deleting user:", error);
      } else {
        await fetchAndSetUsers();
        await fetchAndSetStudents();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setOpenCourseDialog(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  const handleSaveCourse = async (course) => {
    console.log("Saving course:", course);

    if (selectedCourse) {
      if (!course.id) {
        console.error("Error: Course ID is undefined");
        return;
      }

      const { error: updateError } = await supabase
        .from("courses")
        .update({
          unit_code: course.unit_code,
          name: course.name,
          description: course.description,
          instructor_name: course.instructor_name,
          credits: course.credits,
          level_of_difficulty: course.level_of_difficulty,
          prerequisites: course.prerequisites,
          category: course.category,
        })
        .eq("id", course.id);

      if (updateError) {
        console.error("Error updating course:", updateError);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("courses").insert([
        {
          unit_code: course.unit_code,
          name: course.name,
          description: course.description,
          instructor_name: course.instructor_name,
          credits: course.credits,
          level_of_difficulty: course.level_of_difficulty,
          prerequisites: course.prerequisites,
          category: course.category,
        },
      ]);

      if (insertError) {
        console.error("Error adding course:", insertError);
        return;
      }
    }

    await fetchAndSetCourses();
    setOpenCourseDialog(false);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) {
        console.error("Error deleting course:", error);
      } else {
        await fetchAndSetCourses();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleFilterChange = (filters) => {
    setFilteredStudents(
      students.filter((student) => {
        const avgGrade =
          student.list_of_courses.reduce((acc, curr) => acc + curr.grade, 0) /
          student.list_of_courses.length;
        return (
          (!filters.skills.length ||
            filters.skills.some((skill) => student.skills.includes(skill))) &&
          (!filters.courses.length ||
            filters.courses.some((course) =>
              student.list_of_courses.some((c) =>
                courses.find((cr) => cr.name === course && cr.id === c.id)
              )
            )) &&
          (!filters.gradYears.length ||
            filters.gradYears.includes(student.expected_graduate_year)) &&
          (!filters.grades.length ||
            filters.grades.includes(Math.round(avgGrade)))
        );
      })
    );
  };

  const handleEditStudent = (student) => {
    setSelectedUser(student);
    setOpenUserDialog(true);
  };



  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserSearchChange = (event) => {
    setUserSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.name && user.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };
  

  const handleStudentSearchChange = (event) => {
    setStudentSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };

  const handleCourseSearchChange = (event) => {
    setCourseSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) =>
          course.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };



  return (
    <><Container style={{ marginTop: "50px" }}>
      <Paper style={{ padding: "40px", margin: "50px 50px 0 50px" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
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
                style={{ marginBottom: "20px" }} />
              <UserTable
                users={filteredUsers}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FilterPanel
                onFilterChange={handleFilterChange}
                courses={courses} />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Search Students"
                variant="outlined"
                fullWidth
                value={studentSearchQuery}
                onChange={handleStudentSearchChange}
                style={{ marginBottom: "20px" }} />
              <StudentTable
                students={filteredStudents}
                courses={courses}
                onEditStudent={handleEditStudent} />
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
                style={{ marginBottom: "20px" }} />
              <button
                className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black hover:bg-[#00B27B] text-bold hover:bg-[#00B27B]"
                onClick={handleAddCourse}
              >
                Add Course
              </button>
              <CourseTable
                courses={filteredCourses}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse} />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      <UserDialog
        open={openUserDialog}
        user={selectedUser}
        courses={courses}
        onClose={() => setOpenUserDialog(false)}
        onSave={handleSaveUser} />
      <CourseDialog
        open={openCourseDialog}
        course={selectedCourse}
        onClose={() => setOpenCourseDialog(false)}
        onSave={handleSaveCourse} />
    </Container></>
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
