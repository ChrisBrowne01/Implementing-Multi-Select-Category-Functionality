import React from "react";

export const JobList = ({ jobs, onEdit, onDelete, onStatusUpdate }) => {
  return (
    <div className="job-list">
      {jobs.map(job => (
        <JobItem
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};