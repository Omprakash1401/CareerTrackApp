import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

function ApplicationDetails({ applications }) {

  const navigate = useNavigate();

  const { id } = useParams();

  const application = applications.find(
    (application) => application.id.toString() === id
  );

  if (!application) {
    return (
      <div>
        <h1>Application Not Found</h1>

        <button
          onClick={() => navigate("/applications")}
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div>

      <button
        className="back-button"
        onClick={() => navigate("/applications")}
      >
        ← Back to Applications
      </button>


      <div className="details-header">

        <div>
          <h1>{application.company}</h1>

          <p>{application.jobTitle}</p>
        </div>

        <StatusBadge status={application.status} />

      </div>


      <div className="details-card">

        <h2>Application Information</h2>


        <div className="details-grid">

          <div className="detail-item">
            <span>Location</span>
            <strong>{application.location || "Not specified"}</strong>
          </div>


          <div className="detail-item">
            <span>Job Type</span>
            <strong>{application.jobType}</strong>
          </div>


          <div className="detail-item">
            <span>Work Mode</span>
            <strong>{application.workMode}</strong>
          </div>


          <div className="detail-item">
            <span>Application Date</span>
            <strong>{application.applicationDate}</strong>
          </div>

        </div>


        <div className="detail-section">

          <h3>Job Posting</h3>

          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Job Posting ↗
            </a>
          ) : (
            <p>No job URL provided.</p>
          )}

        </div>


        <div className="detail-section">

          <h3>Notes</h3>

          <p>
            {application.notes || "No notes added."}
          </p>

        </div>


        <div className="details-actions">

          <button
            className="add-button"
            onClick={() =>
              navigate(`/applications/edit/${application.id}`)
            }
          >
            Edit Application
          </button>

        </div>

      </div>

    </div>
  );
}

export default ApplicationDetails;