import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { supabase } from "../supabaseClient"; // Import Supabase client

// Options for languages and skills
const languagesOptions = ["English", "Finnish", "Swedish", "Spanish"];
const skillsOptions = [
  "Frontend",
  "AWS",
  "C++",
  "Github",
  "HTML",
  "Python",
  "Bash scripting",
  "NodeJS",
  "React",
  "Databases",
  "Mobile Development",
  "Backend",
  "IoT",
  "Linux",
  "Java",
];
const graduationYears = Array.from({ length: 31 }, (_, i) => 2000 + i);

const StudentProfile = ({ profileData, updateProfile }) => {
  // State for form data, edit mode, and password change dialog
  const [formData, setFormData] = useState({
    ...profileData,
    languages: Array.isArray(profileData.languages) ? profileData.languages : [],
    skills: Array.isArray(profileData.skills) ? profileData.skills : []
  });
  const [editMode, setEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);



  // Update form data when profileData changes
  useEffect(() => {
    setFormData({
      ...profileData,
      languages: Array.isArray(profileData.languages)
        ? profileData.languages
        : [],
      skills: Array.isArray(profileData.skills)
        ? profileData.skills.filter((skill) => skill.trim() !== "")
        : [],
    });
  }, [profileData]);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for select fields
  const handleSelectChange = (name) => (event) => {
    setFormData(prev => ({ ...prev, [name]: event.target.value }));
  };

  // Handle form submission to update profile
  const handleSubmit = () => {
    updateProfile(formData); // This should be replaced with an actual update to Supabase and idk how
    setEditMode(false);
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        setPasswordMessage(`Error fetching user: ${userError.message}`);
        return;
      }

      if (user.email.includes('anonymous')) {
        setPasswordMessage("Password change is not allowed for anonymous users.");
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) {
        setPasswordMessage(`Error: ${passwordError.message}`);
      } else {
        setPasswordMessage("Password updated successfully.");
        setPasswordDialogOpen(false);
      }
    } catch (error) {
      setPasswordMessage(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "#00B27B" }}>
        Profile
      </Typography>
      {editMode ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Student Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="nationality"
                label="Nationality"
                value={formData.nationality}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                name="phone_number"
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="bio"
                label="About Me"
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Languages</InputLabel>
                <Select
                  name="languages"
                  value={formData.languages}
                  onChange={handleSelectChange("languages")}
                  multiple
                  renderValue={(selected) => selected.join(", ")}
                >
                  {languagesOptions.map((language) => (
                    <MenuItem key={language} value={language}>
                      <Checkbox checked={formData.languages.includes(language)} />
                      <ListItemText primary={language} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Professional Skills / Experience</Typography>
              <Divider sx={{ mb: 2 }} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Skills</InputLabel>
                <Select
                  name="skills"
                  value={formData.skills}
                  onChange={handleSelectChange("skills")}
                  multiple
                  renderValue={(selected) => selected.join(", ")}
                >
                  {skillsOptions.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      <Checkbox checked={formData.skills.includes(skill)} />
                      <ListItemText primary={skill} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="expected_graduation_year"
                label="Expected Graduation Year"
                value={formData.expected_graduation_year}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                inputProps={{ min: 2000, max: 2030, step: 1 }}
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ backgroundColor: "#00B27B" }}>
              Save
            </Button>
          </Box>
        </>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Name:</strong> {formData.name}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Country:</strong> {formData.nationality}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Email:</strong> {formData.email}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Phone Number:</strong> {formData.phone_number}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Languages:</strong> {Array.isArray(formData.languages) ? formData.languages.join(", ") : formData.languages}</Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>About Me:</strong> {formData.bio}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Professional Skills / Experience</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Skills:</strong> {Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Expected Graduation Year:</strong> {formData.expected_graduation_year}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                sx={{ backgroundColor: "#00B27B" }}
              >
                Edit
              </Button>
            </Box>
          </Grid>
        </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default StudentProfile;
