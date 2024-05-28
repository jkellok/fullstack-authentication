import React, { useState } from "react";
import { Paper, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

const skills = ["Java", "NodeJS", "Python", "C++", "AWS", "React"];
const gradYears = [2022, 2023, 2024, 2025, 2026, 2027];
const grades = [1, 2, 3, 4, 5];

const FilterPanel = ({ onFilterChange, courses }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedGradYears, setSelectedGradYears] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);

  const handleSkillChange = (skill) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  const handleCourseChange = (course) => {
    setSelectedCourses((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]));
  };

  const handleGradYearChange = (year) => {
    setSelectedGradYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
  };

  const handleGradeChange = (grade) => {
    setSelectedGrades((prev) => (prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]));
  };

  const applyFilters = () => {
    onFilterChange({
      skills: selectedSkills,
      courses: selectedCourses,
      gradYears: selectedGradYears,
      grades: selectedGrades
    });
  };

  return (
    <Paper style={{ padding: "10px", marginBottom: "20px" }}>
      <FormGroup>
        <Typography variant="h6">Filter by Skills</Typography>
        {skills.map((skill) => (
          <FormControlLabel
            key={skill}
            control={<Checkbox checked={selectedSkills.includes(skill)} onChange={() => handleSkillChange(skill)} />}
            label={skill}
          />
        ))}
      </FormGroup>
      <FormGroup>
        <Typography variant="h6">Filter by Courses</Typography>
        {courses.map((course) => (
          <FormControlLabel
            key={course.id}
            control={<Checkbox checked={selectedCourses.includes(course.name)} onChange={() => handleCourseChange(course.name)} />}
            label={course.name}
          />
        ))}
      </FormGroup>
      <FormGroup>
        <Typography variant="h6">Filter by Graduation Year</Typography>
        {gradYears.map((year) => (
          <FormControlLabel
            key={year}
            control={<Checkbox checked={selectedGradYears.includes(year)} onChange={() => handleGradYearChange(year)} />}
            label={year}
          />
        ))}
      </FormGroup>
      <FormGroup>
        <Typography variant="h6">Filter by Average Grade</Typography>
        {grades.map((grade) => (
          <FormControlLabel
            key={grade}
            control={<Checkbox checked={selectedGrades.includes(grade)} onChange={() => handleGradeChange(grade)} />}
            label={grade}
          />
        ))}
      </FormGroup>
      <button
        className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black hover:bg-[#00B27B] text-bold hover:bg-[#00B27B"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </Paper>
  );
};

export default FilterPanel;
