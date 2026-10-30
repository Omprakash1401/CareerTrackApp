import React,{ useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { getApplicationById } from "../services/applicationService";


function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchApplication = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getApplicationById(id);

        if (!cancelled) {
          setApplication(data);
        }
      } catch (err) {
  console.error("Failed to fetch application:", err);

  if (!cancelled) {
    const status = err.response?.status;

    if (status === 404) {
      setError("This application was not found.");
    } else if (!err.response) {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } else {
      setError(
        "Unable to load this application. Please try again."
      );
    }
  }
} finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p>Loading application details...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Application Not Found</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/applications")}>
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