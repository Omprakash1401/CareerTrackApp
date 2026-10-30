
import React, { useState, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import AddApplication from "./pages/AddApplication";
import EditApplication from "./pages/EditApplication";
import ApplicationDetails from "./pages/ApplicationDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { getApplications } from "./services/applicationService";
import {
  getCurrentUser,
  logoutUser
} from "./services/authService";

function App() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const initializeApp = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        setUser(null);
        setApplications([]);
      } else {
        console.error("Failed to initialize CareerTrack:", err);
        setError("Unable to connect to the backend. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handleLogin = async () => {
    await initializeApp();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      setApplications([]);
      setMessage("");
      navigate("/login", { replace: true });
    }
  };

  // Allow registration and login pages to render even when
  // a user already has an active session.
  if (location.pathname === "/register") {
    return user ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Register />
    );
  }

  if (loading) {
    return <p>Checking login and loading CareerTrack...</p>;
  }

  if (!user) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />

      <Toast
        message={message}
        onClose={() => setMessage("")}
      />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          {error ? (
            <div>
              <p>{error}</p>
              <button onClick={() => initializeApp()}>
                Retry
              </button>
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/dashboard"
                element={<Dashboard applications={applications} />}
              />
              <Route
                path="/applications"
                element={
                <Applications
                setMessage={setMessage}
                setApplications={setApplications}
                />
                  }
              />
              <Route
                path="/applications/new"
                element={
                  <AddApplication
                    setApplications={setApplications}
                    setMessage={setMessage}
                  />
                }
              />
              <Route
                path="/applications/edit/:id"
                element={
                  <EditApplication
                    applications={applications}
                    setApplications={setApplications}
                    setMessage={setMessage}
                  />
                }
              />
              <Route
                path="/applications/:id"
                element={<ApplicationDetails />}
              />
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
              />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
