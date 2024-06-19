import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const UserDialog = ({ open, user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user?.id || "",
        name: user?.name || "",
        email: user?.email || ""
      });
    } else {
      setFormData({
        id: "",
        name: "",
        email: ""
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
      <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
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
