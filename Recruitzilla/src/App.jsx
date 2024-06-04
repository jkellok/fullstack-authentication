import React from "react";
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
import StudentTest from "./components/StudentTest";

function App() {
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
              element={<ProtectedRoute allowedRoles={["student", "admin"]} />}
            >
              <Route path="/studenttest" element={<StudentTest />} />
            </Route>

            <Route path="*" element={<Navigate to="/app/filter" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
