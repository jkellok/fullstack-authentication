import React from "react";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  Pagination,
} from "@mui/material";
import StudentCard from "./StudentCard"; // Import the StudentCard component

const StudentGrid = ({
  data,
  selectedSort,
  sortData,
  currentStudents,
  handleCardClick,
  avgGrade,
  stringAvatar,
  studentsPerPage,
  currentPage,
  handlePageChange,
}) => {
  return (
    <Grid item xs={12} md={8}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={6}>
          <Typography color={"white"} variant="h5">
            {`${data.length} matches found`}
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "right" }}>
          <FormControl variant="outlined" size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={selectedSort}
              onChange={(e) => {
                sortData(e.target.value);
              }}
              label="Sort By"
            >
              <MenuItem value={"Name"}>Name</MenuItem>
              <MenuItem value={"Nationality"}>Nationality</MenuItem>
              <MenuItem value={"Grades"}>Grades</MenuItem>
              <MenuItem value={"Expected year of graduation"}>
                Expected year of graduation
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Paper
        style={{
          padding: "16px",
          backgroundColor: "transparent",
          color: "#fff",
          boxShadow: "none",
        }}
      >
        {/* Header */}
        <Card
          style={{
            marginBottom: "15px",
            padding: "10px",
            color: "#fff",
            borderRadius: "12px",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={4}>
              Name
            </Grid>
            <Grid item xs={3}>
              Nationality
            </Grid>
            <Grid item xs={2}>
              Grades
            </Grid>
            <Grid item xs={2}>
              Expected year of graduation
            </Grid>
          </Grid>
        </Card>
        {/* Student Cards */}
        {currentStudents.map((student) => {
          return (
            <StudentCard
              student={student}
              handleCardClick={handleCardClick}
              avgGrade={avgGrade}
              stringAvatar={stringAvatar}
            />
          );
        })}
      </Paper>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Pagination
          count={Math.ceil(data.length / studentsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </Grid>
  );
};

export default StudentGrid;
