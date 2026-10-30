import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../services/applicationService";
import { getErrorMessage } from "../services/errorHandler";

function AddApplication({ setApplications,setMessage })  {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
    const selectedDate = new Date(
      `${formData.applicationDate}T00:00:00`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate > today
    ) {
      newErrors.applicationDate =
        "Enter a valid date that is not in the future.";
    }
  }

  if (formData.jobUrl.trim()) {
    try {
      const url = new URL(formData.jobUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        newErrors.jobUrl = "URL must start with http:// or https://.";
      }
    } catch {
      newErrors.jobUrl = "Please enter a valid URL.";
    }
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


const handleSubmit = async (event) => {
  event.preventDefault();

  const isValid = validateForm();
  if (!isValid) return;

  setIsSubmitting(true);

  try {
    const savedApplication = await createApplication(formData);

    setApplications((previousApplications) => [
      ...previousApplications,
      savedApplication
    ]);

    setMessage("Application added successfully!");
    navigate("/applications");
  } catch (error) {
  console.error("Failed to create application:", error);

  setMessage(
    getErrorMessage(
      error,
      "Failed to save application. Please try again."
    )
  );
}
  finally {
  setIsSubmitting(false);
}
};


  const [formData, setFormData] = useState({
    company: "",
    jobTitle: "",
    location: "",
    jobType: "Internship",
    workMode: "Hybrid",
    applicationDate: "",
    status: "Applied",
    jobUrl: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  return (
    <div>

      <h1>Add New Application</h1>

      <p>Track a new job or internship application.</p>

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
          <label>Location *</label>

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
  required
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
  required
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

          <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Application"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddApplication;