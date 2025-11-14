import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupPage from "./component/SignUp";
import LoginPage from "./component/LogIn";
import { useState, useEffect } from "react";
import Logout from "./component/Logout";
import Profile from "./component/Profile";
import DashboardLayout from "./component/DashboardLayout";
import Calender from "./component/Calender";
import Availibility from "./component/Availibility";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoggedIn(false);
  }, []);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Availibility />} />{" "}
            <Route path="profile" element={<Profile />} />{" "}
            <Route path="calender" element={<Calender />} />{" "}
            <Route path="availability" element={<Availibility />} />{" "}
          </Route>

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route
            path="/logout"
            element={
              isLoggedIn ? (
                <Logout onLogout={() => setIsLoggedIn(false)} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
