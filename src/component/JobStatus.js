import React from 'react';
import deleteIcon from '../images/delete.png';
import editIcon from '../images/edit.png';
import './JobStatus.css';
import './FormButton.css'

// Added props for edit functionality
export const JobStatus = ({ job, updateJobStatus, onDeleteJob, onEditJob }) => {
  // Determine status class based on the job's actual status. Replace space with '-'
  const statusClass = job.status.toLowerCase().replace(/\s/g, '-'); 

  // Define category styles to apply the correct background color
  const categoryStyles = {
    'Read Emails': { backgroundColor: 'orange', color: '#f4f7f6' },
    'Web Parsing': { backgroundColor: 'blue', color: '#f4f7f6' },
    'Send Emails': { backgroundColor: 'yellow', color: '#343a40' },
    'default': { backgroundColor: 'var(--tag-bg-light)' }
  };

  return (
    <div className={`job-item status-${statusClass}`}>
      <div className="card-body">
        <h5 className="card-title">
          {job.title}
        </h5>
        <div className="card-category">
          <div className="card-actions">
            {/* Change or add Delete button icon */}
            <button onClick={() => updateJobStatus(job.id)} className="job-action-button" >
              {/* Conditional text based on current status */}
              {job.status === "To Start" ? "Start Job" :
                job.status === "In Progress" ? "Complete" :
                  job.status === "Completed" ? "Re-open" :
                    "Start Job"
              }
            </button>
          </div>
        </div>
      </div>

      <div className="card-footer">
        {/* Display the multi-selected category centered */}
        <div className="card-footer-col-category">
          {Array.isArray(job.category) && job.category.map((cat) => (
            <button
              type="button"
              key={cat}
              className="job-category-button tag"
              style={categoryStyles[cat] || categoryStyles.default}>
              {cat}
            </button>
          ))}
        </div>
        
        {/* Display the edit and delete actions aligned right */}
        <div className="card-footer-col-actions">
          <div className="edit-button" onClick={() => onEditJob(job.id)}>
            <img src={editIcon} className='editImg' alt="Edit" />
          </div>
          <div className='jobDelete' onClick={() => onDeleteJob(job.id)}>
            <img src={deleteIcon} className='deletingImg' alt="Delete" />
          </div>
        </div>

      </div>
    </div>
  );
};