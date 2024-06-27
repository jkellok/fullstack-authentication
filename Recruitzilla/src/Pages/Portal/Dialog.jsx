import React, { useState, useEffect } from "react";
import { green } from "@mui/material/colors";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Box,
  Slider,
} from "@mui/material";

const StudentDialog = ({ setSelectedStudent, selectedStudent, courses }) => {
  const [gpa, setGpa] = useState(0);
  const [credits, setCredits] = useState(0);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    let grade = 0;
    let creditsCompleted = 0;
    if (selectedStudent) {
      console.log(selectedStudent);
      selectedStudent.list_of_courses.forEach((course) => {
        grade += course.grade;
      });
      let gr = parseFloat(
        (grade / selectedStudent.list_of_courses.length).toFixed(1)
      );
      setGpa(gr);
    }

    if (selectedStudent) {
      setAllCourses(courses);

      selectedStudent.list_of_courses.forEach((course) => {
        creditsCompleted += courses.find(
          (item) => item.id === course.id
        )?.credits;
      });

      setCredits(creditsCompleted);
    }
  }, [selectedStudent, courses]);

  return (
    <Dialog
      open={Boolean(selectedStudent)}
      onClose={() => setSelectedStudent(null)}
      maxWidth="lg"
      PaperProps={{
        style: {
          //maxHeight: "75%", // You can use any unit or percentage you prefer
          //width: "80%",
          //overflowY: "auto", // Adds scrollbar when content overflows
        },
      }}
    >
      <DialogTitle>{selectedStudent ? selectedStudent.name : ""}</DialogTitle>
      <DialogContent>
        {/* Additional information about the student can go here */}
        {selectedStudent && (
          <Paper elevation={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                {/* Left Column */}
                <Box p={3} style={{ height: "75%" }}>
                  {/* Box for Avatar */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "15vh",
                    }}
                  >
                    <Avatar
                      src={selectedStudent.avatar}
                      sx={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                  <p> </p>
                  {/* Boxed block for primary info: Name, country, email and phone number */}
                  <Box
                    border={2}
                    p={2}
                    mt={2}
                    borderColor="grey.300"
                    style={{
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                    }}
                  >
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      style={{ height: "15vh" }}
                    >
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle2"
                          sx={{ lineHeight: "0.5" }}
                        >
                          Student name:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography
                          variant="subtitle1"
                          sx={{ lineHeight: "0.5" }}
                          style={{ fontWeight: "bold" }}
                        >
                          {selectedStudent.name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle2"
                          sx={{ lineHeight: "0.5" }}
                        >
                          Country:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography
                          variant="subtitle1"
                          sx={{ lineHeight: "0.5" }}
                          style={{ fontWeight: "bold" }}
                        >
                          {selectedStudent.nationality}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle2"
                          sx={{ lineHeight: "0.5" }}
                        >
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography
                          variant="subtitle1"
                          sx={{ lineHeight: "0.5" }}
                          style={{ fontWeight: "bold", color: "#1AA7EC" }}
                        >
                          {selectedStudent.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle2"
                          sx={{ lineHeight: "0.5" }}
                        >
                          Phone Number:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography
                          variant="subtitle1"
                          sx={{ lineHeight: "0.5" }}
                          style={{ fontWeight: "bold" }}
                        >
                          +{selectedStudent.phone_number}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    border={2}
                    p={2}
                    mt={2}
                    borderColor="grey.300"
                    style={{
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      height: "15vh",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      style={{ fontWeight: "bold" }}
                    >
                      About me:
                    </Typography>
                    <Typography variant="subtitle2" style={{}}>
                      {selectedStudent.bio}
                    </Typography>
                  </Box>

                  <Box
                    border={2}
                    p={2}
                    mt={2}
                    borderColor="grey.300"
                    style={{
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      height: "12vh",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      style={{ fontWeight: "bold" }}
                    >
                      Languages:
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: "lightgreen", // Replace with the color you want
                        borderRadius: "12px", // Adjust for desired roundness
                        p: 1, // Adjust padding to fit your needs
                        display: "inline-flex", // To keep the Box content-aligned
                        alignItems: "center",
                        justifyContent: "center",
                        height: 24, // Fix the height to match your design
                        marginTop: "1.5vh",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontSize: "12px" }}>
                        English
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={7}>
                {/* Right Column */}
                <Box
                  border={2}
                  p={2}
                  borderColor="grey.300"
                  style={{
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    height: "96%",
                  }}
                  height={"60.5vh"}
                >
                  <Typography
                    variant="h6"
                    sx={{ textAlign: "center", marginBottom: "2vh" }}
                  >
                    Professional skills / experience
                  </Typography>

                  <Grid container spacing={0} alignItems="center" mt={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">
                        Credits completed:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "bold", color: "#2db83d" }}
                      >
                        {credits}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Grade:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "bold", color: "#2db83d" }}
                      >
                        {gpa}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      textAlign: "left",
                      marginTop: "16px",
                      marginBottom: "0px",
                    }}
                  >
                    Courses completed:
                  </Typography>

                  {/* Courses table */}
                  <Box
                    sx={{
                      position: "relative",
                      height: "30vh",
                    }}
                  >
                    <Grid container spacing={0} alignItems="center" ml={0}>
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        ml={0}
                        style={{
                          paddingLeft: "8%",
                        }}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            display: "block",
                            color: "#a0a0a0",
                            textAlign: "center",
                            //paddingLeft: "35%",
                          }}
                        >
                          credits
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography
                          variant="caption"
                          style={{
                            display: "block",
                            color: "#a0a0a0",
                            textAlign: "center",
                          }}
                        >
                          course
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        style={{
                          paddingLeft: "0.5vh",
                          //paddingRight: "10%",
                        }}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            display: "block",
                            color: "#a0a0a0",
                            textAlign: "left",
                          }}
                        >
                          grade
                        </Typography>
                      </Grid>

                      {/* Courses list */}
                      <div
                        style={{
                          //width: "100vw",
                          height: "25vh",
                          overflowY: "auto",
                          marginBottom: "1vh",
                        }}
                      >
                        <Grid container spacing={0}>
                          {selectedStudent.list_of_courses.map((course) => (
                            <React.Fragment key={course.id}>
                              <Grid
                                item
                                xs={12}
                                sm={2}
                                style={{
                                  paddingLeft: "8%",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  style={{
                                    display: "block",
                                    color: "#000",
                                    textAlign: "center",
                                    //marginLeft: "35%",
                                    fontFamily: "Outfit, Arial",
                                  }}
                                >
                                  {allCourses &&
                                    allCourses.find(
                                      (item) => item.id === course.id
                                    )?.credits}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={8}
                                style={{
                                  borderLeft: "2px solid #000",
                                  paddingLeft: "2%",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  style={{
                                    display: "block",
                                    color: "#000",
                                    textAlign: "left",
                                    fontFamily: "Outfit, Arial",
                                  }}
                                >
                                  {allCourses &&
                                    allCourses.find(
                                      (item) => item.id === course.id
                                    )?.name}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={2}
                                style={{
                                  borderLeft: "2px solid #000",
                                  paddingLeft: "4%",
                                  //paddingRight: "10%",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  style={{
                                    display: "block",
                                    color:
                                      course.grade === 5
                                        ? "#4cd038"
                                        : course.grade === 4
                                        ? "#00B4D8"
                                        : "red",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    fontFamily: "Outfit, Arial",
                                  }}
                                >
                                  {course.grade}
                                </Typography>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      </div>
                    </Grid>
                  </Box>

                  <Grid container spacing={0} alignItems="center" mt={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">
                        Expected graduation year:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontWeight: "bold",
                          color: "#2db83d",
                        }}
                      >
                        {selectedStudent.expected_graduation_year}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      style={{
                        paddingBottom: "1vh",
                        paddingTop: "1vh",
                      }}
                    >
                      <Typography variant="subtitle2">
                        Gained skills / experience:
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Skills */}
                  {selectedStudent.skills
                    .filter((skill) => skill.trim() !== "")
                    .map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        marginTop={"3vh"}
                        style={{
                          backgroundColor: "lightblue",
                          color: "navy",
                          fontSize: "14px",
                          margin: "4px",
                          // More styles here
                        }}
                      />
                    ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedStudent(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDialog;
