import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationRow from "../components/ApplicationRow";
import EmptyState from "../components/EmptyState";

function Applications({
  applications,
  setApplications,
  setMessage
}) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");


  /* ================================
     Delete Application
  ================================= */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    setApplications((previousApplications) =>
      previousApplications.filter(
        (application) => application.id !== id
      )
    );

    setMessage("Application deleted successfully!");
  };


  /* ================================
     Search + Filter
  ================================= */

  const filteredApplications = applications.filter(
    (application) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        application.company
          .toLowerCase()
          .includes(search) ||
        application.jobTitle
          .toLowerCase()
          .includes(search) ||
        application.location
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );


  /* ================================
     Sort Applications
  ================================= */

  const sortedApplications = [
    ...filteredApplications
  ].sort((a, b) => {
    const dateA = new Date(a.applicationDate);
    const dateB = new Date(b.applicationDate);

    return sortOrder === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });


  /* ================================
     CSV Helper
  ================================= */

  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
  };


  /* ================================
     Export CSV
  ================================= */

  const handleExportCSV = () => {

    if (applications.length === 0) {
      setMessage("No applications available to export.");
      return;
    }


    const headers = [
      "Company",
      "Job Title",
      "Location",
      "Job Type",
      "Work Mode",
      "Application Date",
      "Status",
      "Job URL",
      "Notes"
    ];


    const rows = applications.map((application) => [
      application.company,
      application.jobTitle,
      application.location,
      application.jobType,
      application.workMode,
      application.applicationDate,
      application.status,
      application.jobUrl,
      application.notes
    ]);


    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) =>
        row.map(escapeCSVValue).join(",")
      )
      .join("\n");


    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "careertrack-applications.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);


    setMessage(
      "Applications exported successfully!"
    );
  };


  return (
    <div>

      {/* ================================
          Page Header
      ================================= */}

      <div className="page-header">

        <div>
          <h1>Applications</h1>

          <p>
            Manage your job and internship applications.
          </p>
        </div>


        <div className="page-header-actions">

          <button
            className="export-button"
            onClick={handleExportCSV}
          >
            ↓ Export CSV
          </button>


          <button
            className="add-button"
            onClick={() =>
              navigate("/applications/new")
            }
          >
            + Add Application
          </button>

        </div>

      </div>


      {/* ================================
          Search / Filters
      ================================= */}

      <div className="applications-controls">

        <input
          type="text"
          placeholder="🔍 Search applications..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />


        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">
            All Status
          </option>

          <option value="Applied">
            Applied
          </option>

          <option value="Assessment">
            Assessment
          </option>

          <option value="Interview">
            Interview
          </option>

          <option value="Offer">
            Offer
          </option>

          <option value="Rejected">
            Rejected
          </option>
        </select>


        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>
        </select>

      </div>


      {/* ================================
          Applications Table
      ================================= */}

      <div className="applications-table">

        <div className="application-row application-header application-row-actions">

          <div>Company</div>

          <div>Position</div>

          <div>Status</div>

          <div>Date</div>

          <div>Actions</div>

        </div>


        {sortedApplications.length > 0 ? (

          sortedApplications.map(
            (application) => (

              <ApplicationRow
                key={application.id}
                application={application}
                showActions={true}
                onDelete={handleDelete}
              />

            )
          )

        ) : (

          <EmptyState
            title={
              applications.length === 0
                ? "No Applications Yet"
                : "No Matching Applications"
            }

            message={
              applications.length === 0
                ? "Start tracking your job and internship applications by adding your first application."
                : "No applications match your current search or status filter."
            }

            buttonText={
              applications.length === 0
                ? "Add Application"
                : "Clear Filters"
            }

            onButtonClick={() => {

              if (applications.length === 0) {

                navigate(
                  "/applications/new"
                );

              } else {

                setSearchTerm("");

                setStatusFilter("all");

              }

            }}
          />

        )}

      </div>

    </div>
  );
}

export default Applications;