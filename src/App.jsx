import React, { useState, useEffect } from "react";
import { Routes, Route,Navigate } from "react-router-dom";
import EditApplication from "./pages/EditApplication";
import Toast from "./components/Toast";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import AddApplication from "./pages/AddApplication";
import ApplicationDetails from "./pages/ApplicationDetails";



function App() {

  const [applications, setApplications] = useState(() => {

    const savedApplications = localStorage.getItem(
      "careerTrackApplications"
    );

    if (savedApplications) {
      return JSON.parse(savedApplications);
    }

    return [];
  });

  const [message, setMessage] = useState("");

  useEffect(() => {

    localStorage.setItem(
      "careerTrackApplications",
      JSON.stringify(applications)
    );

  }, [applications]);


  return (
    <div className="app">

      <Navbar />

      <Toast
        message={message}
        onClose={() => setMessage("")}
      />

      <div className="app-body">

        <Sidebar />

        <main className="main-content">
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
                  applications={applications}
                  setApplications={setApplications}
                  setMessage={setMessage}
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
              element={
                <ApplicationDetails
                  applications={applications}
                />
              }
            />

          </Routes>
        </main>

      </div>

    </div>
  );
}

export default App;