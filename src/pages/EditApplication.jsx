import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateApplication } from "../services/applicationService";
import { getErrorMessage } from "../services/errorHandler";

function EditApplication({ applications, setApplications, setMessage }) {

  const navigate = useNavigate();

  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const application = applications.find(
  (application) => application.id.toString() === id
);

const [formData, setFormData] = useState(() => ({
  company: application?.company || "",
  jobTitle: application?.jobTitle || "",
  location: application?.location || "",
  jobType: application?.jobType || "Internship",
  workMode: application?.workMode || "Hybrid",
  applicationDate: application?.applicationDate || "",
  status: application?.status || "Applied",
  jobUrl: application?.jobUrl || "",
  notes: application?.notes || ""
}));

const [errors, setErrors] = useState({});

if (!application) {
  return (
    <div>
      <h1>Application Not Found</h1>

      <button onClick={() => navigate("/applications")}>
        Back to Applications
      </button>
    </div>
  );
}


  
  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors((previousErrors) => ({
    ...previousErrors,
    [name]: ""
  }));
  };

  

  const validateForm = () => {
  const newErrors = {};

  if (!formData.company.trim()) {
    newErrors.company = "Company name is required.";
  }

  if (!formData.jobTitle.trim()) {
    newErrors.jobTitle = "Job title is required.";
  }

  if (!formData.location.trim()) {
    newErrors.location = "Location is required.";
  }

  if (!formData.applicationDate) {
  newErrors.applicationDate = "Application date is required.";
} else {
  const [year, month, day] = formData.applicationDate
    .split("-")
    .map(Number);

  const selectedDate = new Date(year, month - 1, day);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    newErrors.applicationDate =
      "Application date cannot be in the future.";
  }

  }

  if (formData.jobUrl.trim()) {
    try {
      new URL(formData.jobUrl);
    } catch {
      newErrors.jobUrl = "Please enter a valid URL.";
    }
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


const handleSubmit = async (event) => {
  event.preventDefault();

  if (isSubmitting || !validateForm()) return;

  setIsSubmitting(true);

  try {
    const savedApplication = await updateApplication(
      id,
      formData
    );

    setApplications((previousApplications) =>
      previousApplications.map((item) =>
        String(item.id) === id ? savedApplication : item
      )
    );

    setMessage("Application updated successfully!");
    navigate("/applications");
  } catch (error) {
    console.error("Failed to update application:", error);

    setMessage(
      getErrorMessage(
        error,
        "Failed to update application. Please try again."
      )
    );
  } finally {
    setIsSubmitting(false);
  }
};


  return (
  <div className="edit-page">

    <div className="page-header">
      <div>
        <h1>Edit Application</h1>
        <p>Update your application details.</p>
      </div>
    </div>

    <div className="edit-form-wrapper">
      <div className="form-container">

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Company Name *</label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              
            />
            {errors.company && (
              <p className="form-error">{errors.company}</p>
            )}
          </div>


          <div className="form-group">
            <label>Job Title *</label>

            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              
            />

            {errors.jobTitle && (
  <p className="form-error">{errors.jobTitle}</p>
)}
          </div>


          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            {errors.location && (
  <p className="form-error">{errors.location}</p>
)}
          </div>


          <div className="form-group">
            <label>Job Type *</label>

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              
            >
              <option value="Internship">
                Internship
              </option>

              <option value="Full-time">
                Full-time
              </option>
            </select>
          </div>


          <div className="form-group">
            <label>Work Mode</label>

            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
            >
              <option value="Remote">
                Remote
              </option>

              <option value="Hybrid">
                Hybrid
              </option>

              <option value="On-site">
                On-site
              </option>
            </select>
          </div>


          <div className="form-group">
            <label>Application Date *</label>

            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              
            />

            {errors.applicationDate && (
  <p className="form-error">{errors.applicationDate}</p>
)}
          </div>


          <div className="form-group">
            <label>Status *</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              
            >
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
          </div>


          <div className="form-group">
            <label>Job URL</label>

            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
            />

            {errors.jobUrl && (
  <p className="form-error">{errors.jobUrl}</p>
)}
          </div>


          <div className="form-group">
            <label>Notes</label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>


          <div className="form-actions">

            <button
              type="button"
              onClick={() => navigate("/applications")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving Changes..." : "Update Application"}
            </button>

          </div>

        </form>

      </div>

    </div>
  </div>
);
}

export default EditApplication;