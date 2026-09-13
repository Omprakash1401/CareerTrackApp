import React from "react";
import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

function ApplicationRow({ application, showActions = false,onDelete,onClick }) {

  const navigate = useNavigate();

  return (
    <div
      className={`application-row ${
        showActions ? "application-row-actions" : ""
      } ${onClick ? "application-row-clickable" : ""}`}
      onClick={onClick}
    >

      <div>
        <strong>{application.company}</strong>
      </div>

      <div>
        {application.jobTitle}
      </div>

      <div>
        <StatusBadge status={application.status} />
      </div>

      <div>
        {application.applicationDate}
      </div>

      {showActions && (
        <div className="application-actions">

          <button
            onClick={() =>
              navigate(`/applications/${application.id}`)
            }
          >
            View
          </button>

          <button
            onClick={() =>
            navigate(`/applications/edit/${application.id}`)
            }
          >
           Edit
          </button>

          <button
            onClick={() => onDelete(application.id)}
          >
            Delete
          </button>

        </div>
      )}

    </div>
  );
}

export default ApplicationRow;