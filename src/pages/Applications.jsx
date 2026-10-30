
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ApplicationRow from "../components/ApplicationRow";
import EmptyState from "../components/EmptyState";

import { getErrorMessage } from "../services/errorHandler";
import {
  deleteApplication,
  searchApplications
} from "../services/applicationService";

function Applications({ setMessage, setApplications }) {
  const navigate = useNavigate();

  // Search, filter, sort and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(0);

  // Data returned by the backend
  const [pageData, setPageData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10
  });

  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce search: wait 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setCurrentPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch applications without clearing existing results
  useEffect(() => {
    let cancelled = false;

    const fetchApplications = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await searchApplications({
          search: debouncedSearchTerm,
          status: statusFilter === "all" ? "" : statusFilter,
          page: currentPage,
          size: 10,
          sortBy: "applicationDate",
          direction: sortOrder === "newest" ? "desc" : "asc"
        });

        // Ignore outdated requests
        if (!cancelled) {
          setPageData(data);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);

        if (!cancelled) {
          setError(
            getErrorMessage(err, "Unable to load applications.")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setHasLoaded(true);
        }
      }
    };

    fetchApplications();

    return () => {
      cancelled = true;
    };
  }, [
    debouncedSearchTerm,
    statusFilter,
    sortOrder,
    currentPage,
    refreshKey
  ]);

  // Delete application through Spring Boot
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await deleteApplication(id);

      if (setApplications) {
        setApplications((previousApplications) =>
          previousApplications.filter(
            (application) => application.id !== id
          )
        );
      }

      setMessage("Application deleted successfully!");

      if (pageData.content.length === 1 && currentPage > 0) {
        setCurrentPage((previousPage) => previousPage - 1);
      } else {
        setRefreshKey((previousKey) => previousKey + 1);
      }
    } catch (err) {
      console.error("Failed to delete application:", err);

      setMessage(
        getErrorMessage(err, "Failed to delete application.")
      );
    }
  };

  // CSV helper
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return `"${String(value).replace(/"/g, '""')}"`;
  };

  // Export the currently loaded page to CSV
  const handleExportCSV = () => {
    if (pageData.content.length === 0) {
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

    const rows = pageData.content.map((application) => [
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

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCSVValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "careertrack-applications.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setMessage("Applications exported successfully!");
  };

  // Clear search and filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(0);
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" || statusFilter !== "all";

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Manage your job and internship applications.</p>
        </div>

        <div className="page-header-actions">
          <button
            className="export-button"
            onClick={handleExportCSV}
            disabled={loading || pageData.content.length === 0}
          >
            ↓ Export CSV
          </button>

          <button
            className="add-button"
            onClick={() => navigate("/applications/new")}
          >
            + Add Application
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="applications-controls">
        <input
          type="text"
          placeholder="🔍 Search applications..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(0);
          }}
        >
          <option value="all">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Assessment">Assessment</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sortOrder}
          onChange={(event) => {
            setSortOrder(event.target.value);
            setCurrentPage(0);
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Subtle status instead of replacing the page */}
      {loading && hasLoaded && (
        <p className="table-message">Updating results...</p>
      )}

      {/* Applications Table */}
      <div className="applications-table">
        <div className="application-row application-header application-row-actions">
          <div>Company</div>
          <div>Position</div>
          <div>Status</div>
          <div>Date</div>
          <div>Actions</div>
        </div>

        {loading && !hasLoaded ? (
          <p className="table-message">Loading applications...</p>
        ) : error ? (
          <div className="table-message">
            <p>{error}</p>
            <button
              onClick={() =>
                setRefreshKey((previousKey) => previousKey + 1)
              }
            >
              Retry
            </button>
          </div>
        ) : pageData.content.length > 0 ? (
          pageData.content.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              showActions={true}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <EmptyState
            title={
              hasActiveFilters
                ? "No Matching Applications"
                : "No Applications Yet"
            }
            message={
              hasActiveFilters
                ? "No applications match your search or selected status."
                : "Start tracking your job and internship applications by adding your first application."
            }
            buttonText={
              hasActiveFilters ? "Clear Filters" : "Add Application"
            }
            onButtonClick={() => {
              if (hasActiveFilters) {
                handleClearFilters();
              } else {
                navigate("/applications/new");
              }
            }}
          />
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pageData.totalElements > 0 && (
        <div className="pagination-controls">
          <span>
            {pageData.totalElements} application
            {pageData.totalElements !== 1 ? "s" : ""}
          </span>

          <button
            disabled={currentPage === 0}
            onClick={() =>
              setCurrentPage((page) => page - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {pageData.number + 1} of {pageData.totalPages}
          </span>

          <button
            disabled={currentPage + 1 >= pageData.totalPages}
            onClick={() =>
              setCurrentPage((page) => page + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Applications;
