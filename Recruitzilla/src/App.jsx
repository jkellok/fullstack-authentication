import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext"
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Analytics from "./components/Analytics";
import Newsletter from "./components/Company";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Card from "./components/Card/Card";
import MainPortal from "./Pages/MainPortal";
import LoginSupabase from "./components/LoginSupabase";
import AdminConsole from "./components/AdminConsole";
import TestPage from "./components/TestPage";
import FirstLoginPage from "./components/FirstLoginPage";
import StudentTest from "./components/StudentTest"
import { supabase } from "./supabaseClient";
import { useEffect,useState } from "react";

function App() {
  const [role, setRole] = useState()

  useEffect(() => {
      const get_my_claims = async () => {
      const { data, error } = await supabase.rpc("get_my_claims", {});
      setRole(data.userrole)
    };
    get_my_claims();
  }, []);

  console.log(role)
  let routes;

  if(role === 'admin') {
    routes = (
  
        <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app/filter" element={<MainPortal />} />
            <Route path="/login/supabase" element={<LoginSupabase />} />
            <Route path="/admin-console" element={<AdminConsole />} />
            <Route path="/testpage" element={<TestPage />} />
            <Route path="/firstlogin" element={<FirstLoginPage />} />
            <Route path="/studenttest" element={<StudentTest />} />
          </Routes>
        </div>

    );
  } else if (role === 'student'){
    routes = (
        <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app/filter" element={<MainPortal />} />
            <Route path="/login/supabase" element={<LoginSupabase />} />
            <Route path="/testpage" element={<TestPage />} />
            <Route path="/firstlogin" element={<FirstLoginPage />} />
            <Route path="/studenttest" element={<StudentTest />} />
          </Routes>
        </div>
    );
  } else {
    routes = (
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/filter" element={<MainPortal />} />
          <Route path="/login/supabase" element={<LoginSupabase />} />
          <Route path="*" element={<Navigate to="/app/filter" />} />
        </Routes>
      </div>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>{routes}</main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
