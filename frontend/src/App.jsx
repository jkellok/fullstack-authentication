import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CountriesTable from "./components/CountriesTable";
import CountryForm from "./components/CountryForm";
import AdminPage from "./components/AdminPage";
import StudentPage from "./components/StudentPage";
import RecruiterPage from "./components/RecruiterPage";

const App = () => {
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      const decodedToken = jwtDecode(savedToken);
      setUserRole(decodedToken.role);
    }
  }, []);

  const handleLogout = () => {
    setToken("");
    setUserRole("");
    localStorage.removeItem("token");
    alert("Logged out successfully");
  };

  const handleCountryAdded = () => {
    setRefreshTable((prev) => !prev);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      const decodedToken = jwtDecode(savedToken);
      setUserRole(decodedToken.role);
    }
  }, [token, userRole]);

  return (
    <Router>
      <div className="App">
        <nav>
          <NavLink to="/signup" style={{ marginRight: "10px" }}>
            Signup
          </NavLink>
          <NavLink to="/login" style={{ marginRight: "10px" }}>
            Login
          </NavLink>
          {token && (
            <>
              <NavLink to="/countries" style={{ marginRight: "10px" }}>
                Countries
              </NavLink>
              {userRole === "admin" && (
                <NavLink to="/adminpage" style={{ marginRight: "10px" }}>
                  Admin
                </NavLink>
              )}
              {(userRole === "admin" || userRole === "student") && (
                <NavLink to="/studentpage" style={{ marginRight: "10px" }}>
                  Student
                </NavLink>
              )}
              <NavLink to="/recruiterpage" style={{ marginRight: "10px" }}>
                Recruiter
              </NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/adminpage"
            element={
              token && userRole === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to="/signup" />
              )
            }
          />
          <Route
            path="/studentpage"
            element={
              token && (userRole === "admin" || userRole === "student") ? (
                <StudentPage />
              ) : (
                <Navigate to="/signup" />
              )
            }
          />
          <Route
            path="/recruiterpage"
            element={
              token &&
              (userRole === "admin" ||
                userRole === "student" ||
                userRole === "recruiter") ? (
                <RecruiterPage />
              ) : (
                <Navigate to="/signup" />
              )
            }
          />
          {token ? (
            <Route
              path="/countries"
              element={
                <div>
                  <CountryForm
                    token={token}
                    onCountryAdded={handleCountryAdded}
                  />
                  <CountriesTable token={token} refreshTable={refreshTable} />
                </div>
              }
            />
          ) : (
            <Route path="/countries" element={<Navigate to="/signup" />} />
          )}
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
