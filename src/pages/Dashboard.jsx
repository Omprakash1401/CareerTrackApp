import React from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import ApplicationRow from "../components/ApplicationRow";

function Dashboard({ applications }) {
  const navigate = useNavigate();

  /* ================================
     Basic Application Counts
  ================================= */

  const totalApplications = applications.length;

  const applied = applications.filter(
    (application) => application.status === "Applied"
  );

  const assessments = applications.filter(
    (application) => application.status === "Assessment"
  );

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  );

  const offers = applications.filter(
    (application) => application.status === "Offer"
  );

  const rejected = applications.filter(
    (application) => application.status === "Rejected"
  );


  /* ================================
     Status Distribution
  ================================= */

  const statusData = [
    {
      status: "Applied",
      count: applied.length
    },
    {
      status: "Assessment",
      count: assessments.length
    },
    {
      status: "Interview",
      count: interviews.length
    },
    {
      status: "Offer",
      count: offers.length
    },
    {
      status: "Rejected",
      count: rejected.length
    }
  ];


  /* ================================
     Analytics
  ================================= */

  const progressedApplications =
    totalApplications - applied.length;

  const responseRate =
    totalApplications > 0
      ? (progressedApplications / totalApplications) * 100
      : 0;

  const interviewRate =
    totalApplications > 0
      ? (interviews.length / totalApplications) * 100
      : 0;

  const offerRate =
    totalApplications > 0
      ? (offers.length / totalApplications) * 100
      : 0;

  const rejectionRate =
    totalApplications > 0
      ? (rejected.length / totalApplications) * 100
      : 0;


  /* ================================
     Recent Applications
  ================================= */

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.applicationDate) -
        new Date(a.applicationDate)
    )
    .slice(0, 5);


  /* ================================
     Helper Function
  ================================= */

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };


  return (
    <div>

      {/* ================================
          Page Header
      ================================= */}

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Track your job and internship application progress.
          </p>
        </div>
      </div>


      {/* ================================
          Statistics
      ================================= */}

      <div className="stats-container">

        <StatsCard
          title="Total Applications"
          value={totalApplications}
        />

        <StatsCard
          title="Applied"
          value={applied.length}
        />

        <StatsCard
          title="Assessments"
          value={assessments.length}
        />

        <StatsCard
          title="Interviews"
          value={interviews.length}
        />

        <StatsCard
          title="Offers"
          value={offers.length}
        />

        <StatsCard
          title="Rejected"
          value={rejected.length}
        />

      </div>


      {/* ================================
          Analytics
      ================================= */}

      <h2 className="section-title">
        Application Analytics
      </h2>

      <div className="analytics-container">

        <div className="analytics-card">
          <div className="analytics-card-header">
            <span>Response Rate</span>
            <span className="analytics-icon">↗</span>
          </div>

          <h2>{formatPercentage(responseRate)}</h2>

          <p>
            Applications that moved beyond Applied
          </p>
        </div>


        <div className="analytics-card">
          <div className="analytics-card-header">
            <span>Interview Rate</span>
            <span className="analytics-icon">◎</span>
          </div>

          <h2>{formatPercentage(interviewRate)}</h2>

          <p>
            Applications that reached Interview
          </p>
        </div>


        <div className="analytics-card">
          <div className="analytics-card-header">
            <span>Offer Rate</span>
            <span className="analytics-icon">★</span>
          </div>

          <h2>{formatPercentage(offerRate)}</h2>

          <p>
            Applications that resulted in an Offer
          </p>
        </div>


        <div className="analytics-card">
          <div className="analytics-card-header">
            <span>Rejection Rate</span>
            <span className="analytics-icon">×</span>
          </div>

          <h2>{formatPercentage(rejectionRate)}</h2>

          <p>
            Applications marked as Rejected
          </p>
        </div>

      </div>




      {/* ================================
          Existing Status Progress
      ================================= */}

      <h2 className="section-title">
        Application Progress
      </h2>

      <div className="status-progress">

        {statusData.map((item) => (

          <div
            className="progress-item"
            key={item.status}
          >

            <div className="progress-label">

              <span>{item.status}</span>

              <span>{item.count}</span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width:
                    totalApplications > 0
                      ? `${(item.count / totalApplications) * 100}%`
                      : "0%"
                }}
              ></div>

            </div>

          </div>

        ))}

      </div>


      {/* ================================
          Recent Applications
      ================================= */}

      <h2 className="section-title">
        Recent Applications
      </h2>

      <div className="applications-table">

        <div className="application-row application-header">

          <div>Company</div>

          <div>Position</div>

          <div>Status</div>

          <div>Date</div>

        </div>


        {recentApplications.length > 0 ? (

          recentApplications.map((application) => (

            <ApplicationRow
              key={application.id}
              application={application}
              onClick={() =>
                navigate(
                  `/applications/${application.id}`
                )
              }
            />

          ))

        ) : (

          <div className="empty-state">
  <div className="empty-state-icon">📋</div>

  <h3>No Applications Yet</h3>

  <p>
    Start tracking your job search by adding your first
    job or internship application.
  </p>

  <button
    type="button"
    className="add-button"
    onClick={() => navigate("/applications/new")}
  >
    + Add Your First Application
  </button>
</div>

        )}

      </div>


      {/* ================================
          View All Applications
      ================================= */}

      {applications.length > 0 && (

        <button
          className="view-all-button"
          onClick={() =>
            navigate("/applications")
          }
        >
          View All Applications →
        </button>

      )}

    </div>
  );
}

export default Dashboard;