import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { JobStatus } from './JobStatus';
import './JobColumn.css';
import './AppForm.css'


export const JobColumn = ({
  jobs,
  title,
  image,
  alt,
  statusName,
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

  // Filter jobs: first filter by status, then by search query
  const filteredByStatus = jobs.filter(job => job.status === statusName);
  const filteredJobs = filteredByStatus.filter((job) => {
    return Object.keys(job).some((key) =>
      job[key]?.toString().toLowerCase() 
        .includes(search.toString().toLowerCase())
    );
  });

  // Determine the status class for the column based on the title
  const columnStatusClass = title.toLowerCase().replace(/\s/g, '-');

  return (
    <section>
      <div className={`job-column status-${columnStatusClass}`}>
        <h2 className='heading-status'>{title}</h2>
        <img className="status-image" src={image} alt={alt} />
        <p>Below are jobs that {statusName === "To Start" ? "need to be started:" : `are ${statusName}:`}</p>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided) => (
          <ul
            className='status-board'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {filteredJobs.map((job, index) => (
              <Draggable key={job.id} draggableId={job.id.toString()} index={index}>
                {(providedDraggable) => (
                  <li // Changed div to li for semantic correctness in ul
                    ref={providedDraggable.innerRef}
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

                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditFormChange}
                          className={`edit-select ${formError === 'Please select a category for the edited job.' ? 'input-error' : ''}`}
                        >
                          <option value="">Select Category</option>
                          {['Read Emails', 'Web Parsing', 'Send Emails'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                         {formError === 'Please select a category for the edited job.' && (
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

                      // Display JobStatus component when not editing
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