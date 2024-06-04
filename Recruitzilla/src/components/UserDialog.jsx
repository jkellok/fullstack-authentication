import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip, Autocomplete } from "@mui/material";

const UserDialog = ({ open, user, courses, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: "",
    email: "",
    skills: [],
    courses: [],
    graduationYear: "",
    averageGrade: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user?.id || "",
        name: user?.name || "",
        email: user?.email || "",
        skills: user?.skills || [],
        courses: user?.list_of_courses || [],
        graduationYear: user?.expected_graduate_year || "",
        averageGrade: user?.average_grade || ""
      });
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        skills: [],
        courses: [],
        graduationYear: "",
        averageGrade: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? "Edit Student" : "Add Student"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <Autocomplete
          multiple
          id="skills"
          options={["Java", "NodeJS", "Python", "C++", "AWS", "React"]}
          freeSolo
          value={formData.skills}
          onChange={(event, newValue) => {
            setFormData({ ...formData, skills: newValue });
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Skills" placeholder="Skills" />
          )}
        />
        <Autocomplete
          multiple
          id="courses"
          options={courses}
          getOptionLabel={(option) => option.name}
          value={formData.courses.map(course => courses.find(c => c.id === course.id) || course)}
          onChange={(event, newValue) => {
            setFormData({ ...formData, courses: newValue });
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Courses" placeholder="Courses" />
          )}
        />
        <TextField
          margin="dense"
          name="graduationYear"
          label="Graduation Year"
          type="number"
          fullWidth
          value={formData.graduationYear}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="averageGrade"
          label="Average Grade"
          type="number"
          fullWidth
          value={formData.averageGrade}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
