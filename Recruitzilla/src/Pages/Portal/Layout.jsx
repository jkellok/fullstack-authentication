import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Autocomplete,
  Stack,
  TextField,
  Typography,
  Avatar,
  Pagination,
  Box,
  Slider,
  Chip,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import StudentDialog from "./Dialog"; // The path should be relative to your App.js file
import StudentCard from "./Card";
import studentsData from "../../assets/students_final.json";
import { supabase } from "../../supabaseClient"

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const FilterLabels = ({ label }) => {
  return (
    <Box
      sx={{
        fontSize: 16, // Change to smaller font size
        paddingTop: 1,
        paddingBottom: 2, // Adjust padding
      }}
    >
      <Typography color={"white"} variant="h6">
        {label}
      </Typography>{" "}
    </Box>
  );
};

const grade = [1, 2, 3, 4, 5];
function App() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([]); // Initialize with empty array
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(12);
  const [selectedSort, setSelectedSort] = useState("");

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = data.slice(indexOfFirstStudent, indexOfLastStudent);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchAndSetCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, name, instructor_name, credits");

    if (error) {
      console.error("Error fetching courses:", error);
    } else {
      console.log(data)
      const formattedCourses = data.map((course) => ({
        id: course.id,
        name: course.name,
        instructor_name: course.instructor_name,
        credits: course.credits,
      }));
      setCourses(formattedCourses);
    }
  };

  const allSkills = new Set();
  students.forEach((student) => {
    student.skills.forEach((skill) => {
      allSkills.add(skill);
    });
  });

  const fetchAndSetStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select(
        "id, name, bio, nationality, phone_number, email, skills, expected_graduation_year, list_of_courses(id, course_id, grade)"
      );

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      console.log(data)
      const formattedStudents = data.map((student) => ({
        id: student.id,
        name: student.name,
        bio: student.bio,
        nationality: student.nationality,
        phone_number: student.phone_number,
        email: student.email,
        skills: student.skills,
        expected_graduation_year: student.expected_graduation_year,
        list_of_courses: student.list_of_courses.map((course) => ({
          id: course.course_id,
          grade: course.grade,
        })),
      }));
      setStudents(formattedStudents);
      setData(formattedStudents);
    }
  };
  const allSkillsArray = Array.from(allSkills);

  const uniqueGrades = new Set();
  const uniqueGradYears = new Set();

  students.forEach((student) => {
    uniqueGradYears.add(student.expected_graduation_year);

    const avgGrade =
      student.list_of_courses.reduce((acc, curr) => acc + curr.grade, 0) /
      student.list_of_courses.length;
    uniqueGrades.add(Math.round(avgGrade));
  });

  const uniqueGradesArray = Array.from(uniqueGrades);
  const uniqueGradYearsArray = Array.from(uniqueGradYears);

  const handleCardClick = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    setSelectedStudent(student);
    // Open the dialog here with the selected student's name
  };

  const sortData = (option) => {
    const sortedStudents = [...data].sort((a, b) => {
      if (option === "Name") {
        return a.name.localeCompare(b.name);
      }
      if (option === "Nationality") {
        return a.nationality.localeCompare(b.nationality);
      }
      if (option === "Grades") {
        const avgGradeA =
          a.list_of_courses.reduce((acc, curr) => acc + curr.grade, 0) /
          a.list_of_courses.length;
        const avgGradeB =
          b.list_of_courses.reduce((acc, curr) => acc + curr.grade, 0) /
          b.list_of_courses.length;
        return avgGradeA - avgGradeB;
      }
      if (option === "Expected year of graduation") {
        return a.expected_graduation_year - b.expected_graduation_year;
      }
      return 0;
    });
    setData(sortedStudents);
  };


  useEffect(() => {
    // Fetch local JSON data for students and courses
    // fetch("https://r5ok77p8ki.execute-api.eu-north-1.amazonaws.com/courses")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setCourses(data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching courses:", error);
    //   });

    // fetch("https://r5ok77p8ki.execute-api.eu-north-1.amazonaws.com/students")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setStudents(data);
    //     setData(data); // Populate initial data with fetched students
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching courses:", error);
    //   });

    
    fetchAndSetCourses();
    fetchAndSetStudents();
    
  }, []);

  const handleFilterChange = (event, values) => {
    const newFilters = values.map((value) => value.id);
    setSelectedFilters(newFilters);
    filterData(newFilters);
  };

  const handleSkillFilterChange = (skill) => {
    let newFilters;

    if (selectedFilters.includes(skill)) {
      newFilters = selectedFilters.filter((item) => item !== skill);
    } else {
      newFilters = [...selectedFilters, skill];
    }

    setSelectedFilters(newFilters);
    filterData(newFilters); // Assuming filterData can handle skill filtering
  };
  const filterData = (filters) => {
    if (filters.length === 0) {
      setData(students);
      return;
    }

    const filteredStudents = students.filter((student) => {
      const avgGrade =
        student.list_of_courses.reduce((acc, curr) => acc + curr.grade, 0) /
        student.list_of_courses.length;

      return filters.every((filter) => {
        return (
          student.list_of_courses.some((course) => course.id === filter) ||
          student.skills.includes(filter) ||
          Math.round(avgGrade) === filter ||
          student.expected_graduation_year === filter
        );
      });
    });

    setData(filteredStudents);
  };

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
    filterData([...selectedFilters, event.target.value]);
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  console.log(data.length);
  return (
    <Container style={{ marginLeft: "6vw", marginRight: "5vw" }}>
      <Grid
        container
        spacing={3}
        style={{
          backgroundColor: "#000",
          color: "#fff",
          width: "80vw",
        }}
      >
        {/* Filter Section */}

        <Grid item xs={12} md={4} padding={8}>
          <Paper
            style={{
              paddingLeft: "5px",
              backgroundColor: "black",
              color: "#FFF",
              borderRadius: "12px", // Rounded corners
            }}
          >
            {" "}
            <FilterLabels label={"Search by courses"} />
            <Stack
              spacing={3}
              sx={{
                width: "100%",
                backgroundColor: "#000",
                color: "#fff",
                border: "1px solid grey",
              }}
            >
              <Autocomplete
                multiple
                id="tags-outlined"
                options={courses}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                onChange={handleFilterChange}
                renderInput={(params) => (
                  <TextField
                    style={{ backgroundColor: "#000", color: "#fff" }}
                    {...params}
                    placeholder="Courses"
                    InputProps={{
                      ...params.InputProps,

                      style: { color: "#fff" }, // Apply white color style directly to the input
                    }}
                  />
                )}
                classes={{
                  tag: "custom-tag", // This is the class you can target
                }}
              />
            </Stack>
          </Paper>
          <Paper style={{ backgroundColor: "black", color: "#FFF" }}>
            <FilterLabels label={"Skills"} />

            {allSkillsArray.map((skill) => (
              <Grid item xs={12} md={8}>
                <FormControlLabel
                  key={skill}
                  control={
                    <Checkbox
                      checked={selectedFilters.includes(skill)}
                      onChange={() => handleSkillFilterChange(skill)}
                      name={skill}
                      color="default"
                      style={{
                        "&$checked": {
                          color: "#00e676",
                        },
                        color: selectedFilters.includes(skill)
                          ? "#00e676"
                          : "grey",
                      }}
                    />
                  }
                  label={skill}
                />
              </Grid>
            ))}
          </Paper>
          <Paper style={{ backgroundColor: "#000", color: "#fff" }}>
            <FilterLabels label={"Average Grade"} />

            {grade.map((grade) => (
              <FormControlLabel
                key={grade}
                control={
                  <Checkbox
                    checked={selectedFilters.includes(grade)}
                    onChange={() => handleSkillFilterChange(grade)}
                    name={grade}
                    color="default"
                    style={{
                      "&$checked": {
                        color: "#00e676",
                      },
                      color: selectedFilters.includes(grade)
                        ? "#00e676"
                        : "grey",
                    }}
                  />
                }
                label={grade}
              />
            ))}
          </Paper>
          <Paper style={{ backgroundColor: "#000", color: "#fff" }}>
            <FilterLabels
              style={{ backgroundColor: "#000", color: "#fff" }}
              label={"Graduation Year"}
            />
            {uniqueGradYearsArray.map((year) => (
              <FormControlLabel
                key={year}
                control={
                  <Checkbox
                    checked={selectedFilters.includes(year)}
                    onChange={() => handleSkillFilterChange(year)}
                    name={year}
                    color="default"
                    style={{
                      "&$checked": {
                        color: "#00e676",
                      },
                      color: selectedFilters.includes(year)
                        ? "#00e676"
                        : "grey",
                    }}
                  />
                }
                label={year}
              />
            ))}
          </Paper>
        </Grid>
        {/* Content Section */}
        <Grid item xs={12} md={8}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Typography color={"white"} variant="h5">
                {`${data.length} matches found`}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right", color: "white" }}>
              <FormControl variant="outlined" size="small">
                <InputLabel style={{ color: "white", minWidth: "100px" }}>
                  Sort By
                </InputLabel>
                <Select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    sortData(e.target.value);
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: "#36454F",
                        color: "white",
                      },
                    },
                  }}
                  label="Sort By"
                  sx={{
                    color: "white", // this changes the color of the text
                    "& .MuiSelect-icon": {
                      color: "white", // this changes the color of the dropdown arrow
                    },
                  }}
                >
                  <MenuItem value={"Name"}>Name</MenuItem>
                  <MenuItem value={"Nationality"}>Nationality</MenuItem>
                  <MenuItem value={"Grades"}>Grades</MenuItem>
                  <MenuItem value={"Expected year of graduation"}>
                    Expected year of graduation
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Paper
            style={{
              padding: "16px",
              backgroundColor: "transparent",
              color: "#fff",
              boxShadow: "none",
              // borderRadius: "12px", // Rounded corners
            }}
          >
            {/* Header */}

            <Card
              style={{
                marginBottom: "15px",
                padding: "10px",
                color: "#fff",
                borderRadius: "12px", // Rounded corners
                backgroundColor: "grey",
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  Name
                </Grid>
                <Grid item xs={3}>
                  Nationality
                </Grid>
                <Grid item xs={2}>
                  Grades
                </Grid>
                <Grid item xs={2}>
                  Expected year of graduation
                </Grid>
              </Grid>
            </Card>
            {/* Student Cards */}
            {currentStudents.map((student) => {
              const avgGrade =
                student.list_of_courses.reduce(
                  (acc, curr) => acc + curr.grade,
                  0
                ) / student.list_of_courses.length;

              return (
                <StudentCard
                  student={student}
                  handleCardClick={handleCardClick}
                  avgGrade={avgGrade}
                  stringAvatar={stringAvatar}
                />
              );
            })}
          </Paper>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              count={Math.ceil(data.length / studentsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#fff", // This will change the text color of the pagination items
                },
              }}
            />
          </div>
        </Grid>
      </Grid>
      <StudentDialog
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        courses={courses}
      />
    </Container>
  );
}

export default App;
