import React from 'react';
import deleteIcon from '../images/delete.png';
import editIcon from '../images/edit.png';
import './JobStatus.css';
import { FormButton } from './FormButton';

// Added props for edit functionality
export const JobStatus = ({ job, updateJobStatus, onDeleteJob, onEditJob }) => {
  // Determine status class based on the job's actual status. Replace space with '-'
  const statusClass = job.status.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={`ticket-item status-${statusClass}`}>
      <div className="card-body">
        <h5 className="card-title">
          {job.title}
        </h5>
        <p className="card-category"> 
          <FormButton value={job.category} />{/* Display category */}
        </p>
      </div>

      <div className="card-footer">
        <div className="button-group">
          {/* Change or add Delete button icon */}
          <button onClick={() => updateJobStatus(job.id)} className="job-action-button" >
            {/* Conditional text based on current status */}
            {job.status === "To Start" ? "Start Job" :
             job.status === "In Progress" ? "Complete" :
             job.status === "Completed" ? "Re-open" : // Changed to "Re-open" for completed
             "Resume Job"
            }
          </button>
          {/* Edit button - now functional */}
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