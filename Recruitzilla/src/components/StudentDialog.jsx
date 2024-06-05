import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useAuth } from "./context/AuthContext";

const StudentDialog = ({ open, onClose, student, onSave }) => {
  const { session, updateStudent } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", skills: [], expected_graduate_year: "" });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else if (session) {
      setFormData({
        name: session.user.user_metadata.full_name,
        email: session.user.email,
        skills: session.user.user_metadata.skills || [],
        expected_graduate_year: session.user.user_metadata.expected_graduate_year || "",
      });
    }
  }, [student, session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{student ? "Edit Student" : "Add Student"}</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
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
        />
        <TextField
          name="skills"
          label="Skills"
          value={formData.skills}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="expected_graduate_year"
          label="Graduation Year"
          value={formData.expected_graduate_year}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDialog;
