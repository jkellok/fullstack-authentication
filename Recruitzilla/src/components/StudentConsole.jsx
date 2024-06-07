import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import StudentProfile from "./StudentProfile";
import { useAuth } from "./context/AuthContext";
import StudentDashboard from "./StudentDashboard"; 
import { supabase } from "../supabaseClient"

const StudentConsole = ({ students }) => {
  const { session } = useAuth();
  const [ student, setStudent] = useState([])
  const [selectedView, setSelectedView] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: "",
    country: "",
    email: "",
    phoneNumber: "",
    bio: "",
    languages: "",
    skills: [],
    expected_graduate_year: "",
    courses: []
  });



  useEffect(() => {
    if (session) {
      const { user_metadata: { full_name, country, phone_number, bio, languages, skills, expected_graduate_year, courses } } = session.user;
      setProfileData({
        name: full_name || "",
        country: country || "",
        email: session.user.email || "",
        phoneNumber: phone_number || "",
        bio: bio || "",
        languages: languages || "",
        skills: skills || [],
        expected_graduate_year: expected_graduate_year || "",
        courses: courses || []
      });
    }
  }, [session]);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const updateProfile = (data) => {
    setProfileData(data);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", marginBottom: "20px", color: "#00B27B" }}>
        Student Console
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: "20px" }}>
        <Grid item>
          <Button
            variant={selectedView === 'profile' ? "contained" : "outlined"}
            onClick={() => handleViewChange('profile')}
            sx={{
              backgroundColor: selectedView === 'profile' ? "#00B27B" : "transparent",
              color: selectedView === 'profile' ? "white" : "#00B27B",
              borderColor: "#00B27B",
              '&:hover': {
                backgroundColor: "#008f63",
                borderColor: "#008f63",
                color: "white",
              },
            }}
          >
            Profile
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedView === 'courses' ? "contained" : "outlined"}
            onClick={() => handleViewChange('courses')}
            sx={{
              backgroundColor: selectedView === 'courses' ? "#00B27B" : "transparent",
              color: selectedView === 'courses' ? "white" : "#00B27B",
              borderColor: "#00B27B",
              '&:hover': {
                backgroundColor: "#008f63",
                borderColor: "#008f63",
                color: "white",
              },
            }}
          >
            Courses
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedView === 'grades' ? "contained" : "outlined"}
            onClick={() => handleViewChange('grades')}
            sx={{
              backgroundColor: selectedView === 'grades' ? "#00B27B" : "transparent",
              color: selectedView === 'grades' ? "white" : "#00B27B",
              borderColor: "#00B27B",
              '&:hover': {
                backgroundColor: "#008f63",
                borderColor: "#008f63",
                color: "white",
              },
            }}
          >
            Grades
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedView === 'schedule' ? "contained" : "outlined"}
            onClick={() => handleViewChange('schedule')}
            sx={{
              backgroundColor: selectedView === 'schedule' ? "#00B27B" : "transparent",
              color: selectedView === 'schedule' ? "white" : "#00B27B",
              borderColor: "#00B27B",
              '&:hover': {
                backgroundColor: "#008f63",
                borderColor: "#008f63",
                color: "white",
              },
            }}
          >
            Schedule
          </Button>
        </Grid>
      </Grid>
      <Card sx={{ borderColor: "#00B27B" }}>
        <CardContent>
          {selectedView === 'profile' && (
            <StudentProfile profileData={profileData} updateProfile={updateProfile} />
          )}
          {selectedView !== 'profile' && (
            <StudentDashboard
              students={students}
              courses={courses}
              schedule={schedule}
              notifications={[]}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentConsole;
