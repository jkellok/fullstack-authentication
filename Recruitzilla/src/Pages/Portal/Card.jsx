import React from "react";
import { Grid, Card, Typography, Avatar, Chip } from "@mui/material";

const StudentCard = ({ student, handleCardClick, avgGrade, stringAvatar }) => {
  return (
    <Card
      key={student.id}
      style={{
        marginBottom: "6px",
        padding: "10px",
        color: "#fff",
        backgroundColor: "#36454F",
        borderRadius: "12px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "black",
        },
      }}
      onClick={() => handleCardClick(student.id)}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Avatar alt={student.name} src={student.avatar} />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">{student.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" color={"#D3D3D3"}>
            {student.nationality}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Chip label={`${avgGrade.toFixed(1)}/5.0`} color="success" />
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle1">
            <Chip label={`${student.expected_graduate_year}`} color="primary" />
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default StudentCard;
