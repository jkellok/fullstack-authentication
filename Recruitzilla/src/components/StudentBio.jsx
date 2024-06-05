import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const StudentBio = ({ bioData, updateBio }) => {
  const [bio, setBio] = useState(bioData);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setBio(bioData);
  }, [bioData]);

  const handleChange = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = () => {
    updateBio(bio);
    setEditMode(false);
  };

  return (
    <Box>
      <Typography variant="h5">About Me</Typography>
      {editMode ? (
        <>
          <TextField
            name="bio"
            label="Bio"
            value={bio}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1">{bio}</Typography>
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </>
      )}
    </Box>
  );
};

export default StudentBio;
