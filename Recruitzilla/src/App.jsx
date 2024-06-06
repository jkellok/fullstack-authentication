import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import MainPortal from "./Pages/MainPortal";
import LoginSupabase from "./components/LoginSupabase";
import AdminConsole from "./components/AdminConsole";
import TestPage from "./components/TestPage";
import FirstLoginPage from "./components/FirstLoginPage";
import UserManagement from "./components/UserManagement";
import StudentTest from "./components/StudentTest";
import StudentDashboard from "./components/StudentDashboard";
import StudentConsole from "./components/StudentConsole";

function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Use mock data for testing
    const mockStudents = [
      {
        name: "John Doe",
        country: "USA",
        email: "john.doe@example.com",
        phoneNumber: "123-456-7890",
        bio: "A passionate student.",
        languages: ["English", "Spanish"],
        skills: ["Java", "React"],
        expected_graduate_year: 2023,
        courses: ["Mathematics 1", "Programming Language 1"],
        averageGrade: 4.2
      },
      // Add more mock student data
    ];
    const mockCourses = [
      // Add mock courses data
    ];
    const mockSchedule = [
      // Add mock schedule data
    ];
    const mockNotifications = [
      // Add mock notifications data
    ];

    setStudents(mockStudents);
    setCourses(mockCourses);
    setSchedule(mockSchedule);
    setNotifications(mockNotifications);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app/filter" element={<MainPortal />} />
            <Route path="/login/supabase" element={<LoginSupabase />} />
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin-console" element={<AdminConsole />} />
            </Route>
            <Route path="/testpage" element={<TestPage />} />
            <Route path="/firstlogin" element={<FirstLoginPage />} />
            <Route
              element={<ProtectedRoute allowedRoles={["student", "admin", "recruiter"]} />}
            >
              <Route path="/usermanagement" element={<UserManagement />} />
            </Route>
            <Route
              element={<ProtectedRoute allowedRoles={["student", "admin"]} />}
            >
              <Route path="/studenttest" element={<StudentTest />} />
            </Route>
            <Route
              element={<ProtectedRoute allowedRoles={["student", "admin"]} />}
            >
              <Route path="/student-console" element={
                <StudentDashboard
                  students={students}
                  courses={courses}
                  schedule={schedule}
                  notifications={notifications}
                />
              } />
            </Route>
            <Route
              element={<ProtectedRoute allowedRoles={["student", "admin"]} />}
            >
              <Route path="/student-dashboard" element={
                <StudentConsole
                  students={students}
                  courses={courses}
                  schedule={schedule}
                />
              } />
            </Route>
            <Route path="*" element={<Navigate to="/app/filter" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
