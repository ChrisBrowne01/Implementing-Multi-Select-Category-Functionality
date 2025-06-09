import React, { useState } from 'react';
import { FormButton } from './FormButton';
import { FilterForm } from './FilterForm'; // Corrected import to FilterForm
import './AppForm.css'; // Assuming AppForm.css exists and is for form styles
import './FormButton.css'; // For the tag buttons

export const JobForm = ({ addNewJob, newJob, setNewJob, search, setSearch, error, setError }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [activityFormData, setActivityFormData] = useState({
      activity: "",
      status: "InProgress",
      category: []
    });
  // Define consistent categories and statuses
  const categories = ['Read Emails', 'Web Parsing', 'Send Emails'];
  // Ensure this matches statuses used in App.js and JobStatus.js
  const statuses = ['To Start', 'In Progress', 'Completed'];

  // Change handler for input fields (title, status, and the new category select)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prevJob => ({ ...prevJob, [name]: value }));

    // Clear specific error messages when input changes and meets basic criteria
    if (name === 'title' && value.trim().length >= 3) {
      setError(prevError => (prevError === 'Job title is required.' || prevError === 'Job title must be at least 3 characters long.') ? '' : prevError);
    } else if (name === 'category' && value !== '') {
      setError(prevError => prevError === 'Please select a category.' ? '' : prevError);
    } else if (name === 'status' && value !== '') {
        setError(prevError => prevError === 'Please select a status.' ? '' : prevError);
    }
  };

  // Handles clicking the category buttons (category)
 /*  const handleCategoryClick = (value) => { // Removed event object, directly use value
    setNewJob(prevJob => ({ ...prevJob, category: value }));
    // Clear error message if user selects a category after an error
    setError(prevError => prevError === 'Please select a category.' ? '' : prevError);
  }; */
  const selectCategory = (cat) => {
    if (activityFormData.category.some(item => item === cat)) {
      const filterCategory = activityFormData.category.filter(item => item !== cat)
      setActivityFormData(prev => {
        return{...prev, category:filterCategory}
      })
    } else {
      setActivityFormData(prev => {
        return{...prev, category:[...prev.category, cat]}
      })   
    }
  }
  console.log(activityFormData.category);


  // Reset the form fields to their initial empty/default state
  const resetForm = () => {
    setNewJob({
      title: '',
      category: '',
      status: 'To Start'
    });
    setError(""); // Clear any form-wide error messages
    setSuccessMessage(''); // Also clear success message
  };

  // Handle on Submit function
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic (more specific error messages)
    if (!newJob.title.trim()) {
      setError('Job title is required.');
      return;
    }
    if (newJob.title.trim().length < 3) {
      setError('Job title must be at least 3 characters long.');
      return;
    }
    if (!newJob.category || newJob.category === '') {
      setError('Please select a category.');
      return;
    }
    if (!newJob.status || newJob.status === '') { // Check against empty string now that 'Select status...' is removed as a value
        setError('Please select a status.');
        return;
    }

    // If validation passes:
    console.log('Job Details Submitted:', newJob);

    addNewJob(newJob);

    // Add visual feedback when a job is successfully added
    setSuccessMessage('Job successfully added!');
    resetForm(); 

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Determine if the submit button should be disabled
  /* const isSubmitDisabled =
    !newJob.title.trim() ||
    newJob.title.trim().length < 3 ||
    !newJob.category ||
    newJob.category === '' ||
    !newJob.status ||
    newJob.status === ''; */

  return (
    <div className="form-header">
      <form onSubmit={handleSubmit}>
        <div>
          {/* An input field for entering job titles */}
          <input
            type="text"
            name="title"
            value={newJob.title}
            onChange={handleInputChange}
            className={`bot-input ${error && (newJob.title.trim().length < 3 || !newJob.title.trim()) ? 'input-error' : ''}`}
            placeholder="Enter the job"
            aria-describedby="title-error-message"
          />
          {error && (error === 'Job title is required.' || error === 'Job title must be at least 3 characters long.') && (
            <p id="title-error-message" className="error-message">{error}</p>
          )}
        </div>

        {/* Buttons for selecting job categories */}
        <div className="form-details">
          <div className="bottom-line">
            {categories.map(category => (
              <FormButton
                key={category}
                value={category}
                selectCategory={selectCategory} // Pass function that calls with value
                isSelected={newJob.category === category}
              />
            ))}
            {/* Removed the duplicate category select as per previous recommendation */}
          </div>
          {error === 'Please select a category.' && (
            <p className="error-message">{error}</p>
          )}
        </div>

        <div>
          {/* A dropdown menu for selecting job status */}
          <select
            className={`job-status ${error === 'Please select a status.' ? 'input-error' : ''}`}
            name="status"
            value={newJob.status}
            onChange={handleInputChange}
          >
            <option value="">Select status...</option> {/* Default empty option */}
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {error === 'Please select a status.' && (
            <p className="error-message">{error}</p>
          )}
        </div>

        {/* A submit button to add the job */}
        <button type="submit" className="submit-data" /* disabled={isSubmitDisabled} */>
          Add Jobs
        </button>

        {/* Display success message */}
        {successMessage && (<p className="success-message">{successMessage}</p>)}

      </form>

      {/* FilterForm is now correctly imported and used separately */}
      <FilterForm
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
};