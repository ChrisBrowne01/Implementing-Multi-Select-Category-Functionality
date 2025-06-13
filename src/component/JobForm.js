import React, { useState } from 'react';
import { FormButton } from './FormButton';
import { FilterForm } from './FilterForm';
import './AppForm.css';
import './FormButton.css'; // Make sure this CSS file exists for tag styling

export const JobForm = ({ addNewJob, newJob, setNewJob, search, setSearch, error, setError }) => {
  const [successMessage, setSuccessMessage] = useState('');

  const categories = ['Read Emails', 'Web Parsing', 'Send Emails']; 
  const statuses = ['To Start', 'In Progress', 'Completed']; 

  // handleInputChange remains largely the same for title and status
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prevJob => ({ ...prevJob, [name]: value }));

    // Clear specific error messages when input changes and meets basic criteria
    if (name === 'title' && value.trim().length >= 3) {
      setError(prevError => (prevError === 'Job title is required.' || prevError === 'Job title must be at least 3 characters long.') ? '' : prevError);
    } else if (name === 'status' && value !== '') {
      setError(prevError => prevError === 'Please select a status.' ? '' : prevError);
    }
  };

  const validateCategory = (cat) => {
    return newJob.category.some(item => item === cat)
  }

  // Implement the selectCategory function
  const selectCategory = (categoryValue) => {
    setNewJob(prevJob => {
      const currentCategories = prevJob.category || [];

      if (currentCategories.includes(categoryValue)) {
        // If selected, remove it
        const updatedCategories = currentCategories.filter(cat => cat !== categoryValue);
        setError(prevError => prevError === 'Please select at least one category.' ? '' : prevError); 
        return { ...prevJob, category: updatedCategories };
      } else {
        if (currentCategories.length >= 3) { 
          setError('Maximum of 3 categories can be selected.');
          return prevJob; 
        }
        const updatedCategories = [...currentCategories, categoryValue];
        setError(prevError => prevError === 'Please select at least one category.' ? '' : prevError); 
        return { ...prevJob, category: updatedCategories };
      }
    });
  };

  // 6. Add a "Clear Categories" button
  const handleClearCategories = () => {
    setNewJob(prevJob => ({ ...prevJob, category: [] }));
    setError(""); 
  };

  // Reset the form fields to their initial empty/default state
  const resetForm = () => {
    setNewJob({
      title: '',
      category: [], 
      status: 'To Start'
    });
    setError("");
    setSuccessMessage('');
  };

  // Handle on Submit function
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic for multi-select
    if (!newJob.title.trim()) {
      setError('Job title is required.');
      return;
    }
    if (newJob.title.trim().length < 3) {
      setError('Job title must be at least 3 characters long.');
      return;
    }
    // 5. Implement form validation: Ensure at least one category is selected
    if (newJob.category.length === 0) {
      setError('Please select at least one category.');
      return;
    }
    if (!newJob.status || newJob.status === '') {
      setError('Please select a status.');
      return;
    }

    console.log('Job Details Submitted:', newJob); // 4. Modify handleSubmit to include selected categories

    addNewJob(newJob); 

    setSuccessMessage('Job successfully added!');
    resetForm(); 

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    !newJob.title.trim() ||
    newJob.title.trim().length < 3 ||
    newJob.category.length === 0 || 
    !newJob.status ||
    newJob.status === '';

  return (
    <div className="form-header">
      <form onSubmit={handleSubmit}>
        <div>
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

        <div className="form-details">
          <label>Select Categories:</label>
          <div className="bottom-line category-buttons">
            {categories.map(category => (
              <FormButton key={category} value={category.replace(/\s/gm, '')} selectCategory={selectCategory} selected={validateCategory(category.replace(/\s/gm, ''))} />
              // <FormButton              value="ReadEmails" selectCategory={selectCategory} selected={validateCategory("ReadEmails")} />
            ))}
          </div>
          {error === 'Please select at least one category.' && (
            <p className="error-message">{error}</p>
          )}
          {error === 'Maximum of 3 categories can be selected.' && ( // Error for max limit
            <p className="error-message">{error}</p>
          )}

          {/* 3. Display the list of selected categories */}
          {newJob.category.length > 0 && (
            <div className="selected-categories-display">
              <strong>Selected:</strong> {newJob.category.join(', ')}
            </div>
          )}

          {/* Clear Categories Button */}
          {newJob.category.length > 0 && (
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={handleClearCategories}
              className="clear-categories-button"
            >
              Clear Categories
            </button>
          )}
        </div>

        <div>
          <select
            className={`job-status ${error === 'Please select a status.' ? 'input-error' : ''}`}
            name="status"
            value={newJob.status}
            onChange={handleInputChange}
          >
            <option value="">Select status...</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {error === 'Please select a status.' && (
            <p className="error-message">{error}</p>
          )}
        </div>

        <button type="submit" className="submit-data" disabled={isSubmitDisabled}>
          Add Jobs
        </button>

        {successMessage && (<p className="success-message">{successMessage}</p>)}

      </form>

      <FilterForm
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
};