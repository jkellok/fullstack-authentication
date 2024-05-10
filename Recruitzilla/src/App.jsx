import React from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Analytics from "./components/Analytics";
import Newsletter from "./components/Company";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Card from "./components/Card/Card";
import MainPortal from "./Pages/MainPortal";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/filter" element={<MainPortal />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
