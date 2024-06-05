import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const StudentRegistrationForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
    phoneNumber: '',
    bio: '',
    languages: '',
    expectedGraduationYear: '',
    skills: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onRegister(formData);
  };

  return (
    <Box>
      <Typography variant="h5">Student Registration</Typography>
      <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="password" label="Password" value={formData.password} onChange={handleChange} type="password" fullWidth margin="normal" />
      <TextField name="country" label="Country" value={formData.country} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="bio" label="Bio" value={formData.bio} onChange={handleChange} fullWidth multiline rows={4} margin="normal" />
      <TextField name="languages" label="Languages" value={formData.languages} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="expectedGraduationYear" label="Expected Graduation Year" value={formData.expectedGraduationYear} onChange={handleChange} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
        Register
      </Button>
    </Box>
  );
};

export default StudentRegistrationForm;
