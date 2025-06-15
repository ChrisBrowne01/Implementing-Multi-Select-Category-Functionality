import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { JobStatus } from './JobStatus';
import './JobColumn.css';
import './AppForm.css'
import { FormButton } from './FormButton';


export const JobColumn = ({
  jobs,
  title,
  image,
  alt,
  status,
  search,
  updateJobStatus,
  onDeleteJob,
  onEditJob,
  droppableId,
  editingJob,
  editForm,
  handleEditFormChange,
  saveEdit,
  cancelEdit,
  formError
}) => {

  // Define categories (should match what's in JobForm.js for consistency)
  const categories = ['Read Emails', 'Web Parsing', 'Send Emails'];

  // Define category styles (should match what's in JobForm.js/JobStatus.js)
  const categoryTagStyles = {
    'Read Emails': { backgroundColor: 'orange', color: '#f4f7f6' },
    'Web Parsing': { backgroundColor: 'blue', color: '#f4f7f6' },
    'Send Emails': { backgroundColor: 'yellow', color: '#343a40' },
    'default': { backgroundColor: 'var(--tag-bg-light)' }
  };

  // Filter jobs: first filter by status, then by search query
  const filteredByStatus = jobs.filter(job => job.status === status);
  const filteredJobs = filteredByStatus.filter((job) => {
    return Object.keys(job).some((key) =>
      job[key]?.toString().toLowerCase()
        .includes(search.toString().toLowerCase())
    );
  });

  // Determine the status class for the column based on the title
  const columnStatusClass = title.toLowerCase().replace(/\s/g, '-');

  // New handler for category selection in the edit form
  const handleCategoryEditSelection = (categoryValue) => {
    // This is similar to selectCategory in JobForm, but operates on editForm.category
    const currentCategories = editForm.category || [];

    if (currentCategories.includes(categoryValue)) {
      // If selected, remove it
      const updatedCategories = currentCategories.filter(cat => cat !== categoryValue);
      handleEditFormChange({ target: { name: 'category', value: updatedCategories } });
    } else {
      // If not selected, add it
      if (currentCategories.length >= 3) {
        formError(prevError => (prevError === 'Job title is required.' || prevError === 'Job title must be at least 3 characters long.') ? '' : prevError);
        return;
      }
      const updatedCategories = [...currentCategories, categoryValue];
      handleEditFormChange({ target: { name: 'category', value: updatedCategories } });
    }
  };

  // Helper to check if a category is selected in the edit form
  const isCategorySelectedInEditForm = (cat) => {
    return Array.isArray(editForm.category) && editForm.category.includes(cat);
  };

  return (
    <section>
      {/* Column Header Tile */}
      <div className={`job-column status-${columnStatusClass}`}>
        <h2 className='heading-status'>{title}</h2>
        <img className="status-image" src={image} alt={alt} />
        <p>Below are jobs {status === "To Start" ? "which need to Start:" : `that are ${status}:`}</p>
      </div>
      {/* Droppable area for jobs */}
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <ul
            className='status-board'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {filteredJobs.map((job, index) => (
              // Draggable job item
              <Draggable key={job.id} draggableId={job.id.toString()} index={index}>
                {(providedDraggable) => (
                  <li ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    {...providedDraggable.dragHandleProps}
                    className="draggable-item"
                  >
                    {/* Conditional rendering for edit mode */}
                    {editingJob === job.id ? (
                      <form onSubmit={saveEdit} className={`edit-job-form status-${columnStatusClass}`}>
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditFormChange}
                          placeholder="Edit job title"
                          className={`edit-input ${formError && (editForm.title.trim().length < 3 || editForm.title.trim()) ? 'input-error' : ''}`}
                        />
                        {formError && ((formError.includes("Job Title") && formError.includes("empty")) || formError.includes("3 characters")) && (
                          <p className="error-message">{formError}</p>
                        )}

                        {/* Category for edit form - now multi-select buttons */}
                        <div className="edit-category-buttons-group">
                          <label>Edit Categories:</label>
                          <div className="category-buttons">
                            {categories.map(category => {
                              const isSelected = isCategorySelectedInEditForm(category);
                              const buttonStyle = isSelected ? categoryTagStyles[category] : categoryTagStyles.default;

                              return (
                                <FormButton
                                  key={category}
                                  value={category}
                                  onClick={() => handleCategoryEditSelection(category)}
                                  className={`tag ${isSelected ? 'selected-tag' : ''}`}
                                  style={buttonStyle}
                                />
                              );
                            })}
                          </div>
                        </div>
                        {formError === 'Please select at least one category for the edited job.' && (
                          <p className="error-message">{formError}</p>
                        )}

                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditFormChange}
                          className={`edit-select ${formError === 'Please select a status for the edited job.' ? 'input-error' : ''}`}
                        >
                          <option value="">Select Status</option>
                          {['To Start', 'In Progress', 'Completed'].map(stat => (
                            <option key={stat} value={stat}>{stat}</option>
                          ))}
                        </select>
                        {formError === 'Please select a status for the edited job.' && (
                          <p className="error-message">{formError}</p>
                        )}

                        <div className="edit-form-actions">
                          <button type="submit" className="save-edit-button">Save</button>
                          <button type="button" onClick={cancelEdit} className="cancel-edit-button">Cancel</button>
                        </div>
                      </form>
                    ) : (
                    <JobStatus
                      job={job}
                      updateJobStatus={updateJobStatus}
                      onDeleteJob={onDeleteJob}
                      onEditJob={onEditJob}
                    />
                    )}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </section>
  );
};