import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
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

const AppContent = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { session, loading } = useAuth();


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/app/filter"
        element={session ? <MainPortal /> : <Navigate to="/" />}
      />
      <Route path="/login/supabase" element={<LoginSupabase />} />
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin-console" element={<AdminConsole />} />
      </Route>
      <Route path="/testpage" element={<TestPage />} />
      <Route path="/firstlogin" element={<FirstLoginPage />} />
      <Route element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
        <Route path="/studenttest" element={<StudentTest />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
        <Route
          path="/student-console"
          element={<StudentDashboard />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/app/filter" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              element={<ProtectedRoute allowedRoles={["student", "admin", "recruiter"]} />}
            >
            <Route path="/app/filter" element={<MainPortal />} />
            </Route>
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
                />
              } />
            </Route>
            <Route
              element={<ProtectedRoute allowedRoles={["student", "admin"]} />}
            >
              <Route path="/student-dashboard" element={
                <StudentConsole
                />
              } />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
