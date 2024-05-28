import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const CourseDialog = ({ open, course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    unit_code: "",
    name: "",
    description: "",
    instructor_name: "",
    credits: "",
    level_of_difficulty: "",
    prerequisites: "",
    category: ""
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        id: "",
        unit_code: "",
        name: "",
        description: "",
        instructor_name: "",
        credits: "",
        level_of_difficulty: "",
        prerequisites: "",
        category: ""
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{course ? "Edit Course" : "Add Course"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Course Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="instructor_name"
          label="Instructor Name"
          type="text"
          fullWidth
          value={formData.instructor_name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="credits"
          label="Credits"
          type="number"
          fullWidth
          value={formData.credits}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="level_of_difficulty"
          label="Level of Difficulty"
          type="text"
          fullWidth
          value={formData.level_of_difficulty}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="prerequisites"
          label="Prerequisites"
          type="text"
          fullWidth
          value={formData.prerequisites}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="category"
          label="Category"
          type="text"
          fullWidth
          value={formData.category}
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

export default CourseDialog;
