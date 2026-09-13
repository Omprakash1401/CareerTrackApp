import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddApplication({ setApplications,setMessage })  {

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

    // console.log("Selected date:", formData.applicationDate);

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

  const handleSubmit = (event) => {
  event.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  const newApplication = {
    id: Date.now(),
    ...formData
  };

  setApplications((previousApplications) => [
    ...previousApplications,
    newApplication
  ]);

  setMessage("Application added successfully!");

  navigate("/applications");
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

          <button
            type="submit"
            className="add-button"
          >
            Add Application
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddApplication;