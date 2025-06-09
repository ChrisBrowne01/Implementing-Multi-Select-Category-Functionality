import React, { useState, useEffect } from "react";
import { DragDropContext } from '@hello-pangea/dnd';
import { Header } from "./component/Header";
import { Footer } from './component/Footer';
import { JobColumn } from "./component/JobColumn";
import toDoIcon from './images/to-do-icon.jpg';
import inProgressIcon from './images/in-progress-icon.png';
import doneIcon from './images/done-icon.png';
import './App.css';

function App() {
  // Define consistent status options for the entire application
  // const ALL_STATUSES = ['To Start', 'In Progress', 'Completed'];

  // Initialize job list objects from localStorage or default values
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      return JSON.parse(savedJobs);
    }
    // Default jobs if no saved jobs
    return [
      { id: 1, title: 'Parse Emails', status: 'To Start', category: 'Read Emails' },
      { id: 2, title: 'SAP Extraction', status: 'In Progress', category: 'Web Parsing' },
      { id: 3, title: 'Generate Report', status: 'Completed', category: 'Send Emails' }
    ];
  });

  // Persist jobs to localStorage whenever 'jobs' state changes
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  // State for search filter
  const [search, setSearch] = useState("");

  // State for new job form inputs (managed in App.js)
  const [newJob, setNewJob] = useState({
    title: '',
    category: [],
    status: 'To Start'
  });

  // States for edit functionality
  const [editingJob, setEditingJob] = useState(null); 
  const [editForm, setEditForm] = useState({ id: '', title: '', status: '', category: [] });

  // State for form-wide error messages (passed to JobForm)
  const [error, setError] = useState("");

  // Initialize dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true'; 
  });

  // Effect to apply/remove the 'dark-mode' class on the body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Delete job based on ID
  const onDeleteJob = (id) => { setJobs(jobs.filter((job) => job.id !== id));
    // If the deleted job was being edited, clear the editing state
    if (editingJob === id) {
      setEditingJob(null);
      setEditForm({ id: '', title: '', status: '', category: [] });
    }
  };

  // Update job status based on condition (JobStatus component's "Start/Complete" button)
  const updateJobStatus = (id) => {
    setJobs(
      jobs.map(job => 
        job.id === id ?
          { ...job, status: (job.status === "To Start") ? "In Progress" : job.status === "In Progress" ? "Completed" : "To Start" }
          : job
      )
    );
  };

  // Add new job functionality (called by JobForm)
  const addNewJob = (jobDetails) => { 
    // Basic validation is now handled in JobForm, but a final check here is good
    if (!jobDetails.title.trim() || jobDetails.title.trim().length < 3 || !jobDetails.category || !jobDetails.status || jobDetails.status === 'Select status...') {
        setError("Please fill all fields correctly.");
        return;
    }
    

    // Generate unique ID
    const maxId = jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) : 0;
    const newId = maxId + 1;

    const newJobListing = {
      id: newId,
      title: jobDetails.title.trim(),
      status: jobDetails.status.trim(),
      category: jobDetails.category
    };

    setJobs(prevJobs => [...prevJobs, newJobListing]);

    // Reset the newJob state in App.js. JobForm will pick this up via props.
    setNewJob({ title: '', category: '', status: 'To Start' });
    setError(""); // Clear any form-wide error after successful addition

    console.log("Submitting Job:", newJobListing);
    console.log("All Jobs:", [...jobs, newJobListing]);
  };

  // Edit Functions
  // Start editing a job
  const onEditJob = (jobId) => { // Takes jobId as argument
    const jobToEdit = jobs.find(job => job.id === jobId);
    if (jobToEdit) {
      setEditingJob(jobId);
      setEditForm({ ...jobToEdit });
      setError(""); 
    }
  };

  // Handle changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevEditForm => ({ ...prevEditForm, [name]: value }));
    setError(""); 
  };

  // Save changes from the edit form
  const saveEdit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setError("Job Title cannot be empty.");
      return;
    }
    if (editForm.title.trim().length < 3) {
      setError("Job Title must be at least 3 characters.");
      return;
    }
    if (!editForm.category || editForm.category === '') {
      setError("Please select a category for the edited job.");
      return;
    }
    if (!editForm.status || editForm.status === '') {
        setError("Please select a status for the edited job.");
        return;
    }

    setJobs(jobs.map(job =>
      job.id === editingJob ? { ...editForm } : job
    ));
    setEditingJob(null);
    setEditForm({ id: '', title: '', status: '', category: [] }); 
    setError(""); 
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setEditForm({ id: '', title: '', status: '', category: [] });
    setError("");
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const draggedJob = jobs.find(job => job.id === parseInt(draggableId));
    if (!draggedJob) {
      return;
    }

    // Create a new array of jobs to avoid direct mutation
    const newJobs = Array.from(jobs);

    // Remove the dragged job from its original position
    const oldIndex = newJobs.findIndex(job => job.id === draggedJob.id);
    newJobs.splice(oldIndex, 1);

    // Update the status of the dragged job based on the destination column
    const updatedDraggedJob = { ...draggedJob, status: destination.droppableId }; // Use droppableId directly as new status

    // Find the correct index to insert into the destination column
    // const destinationColumnJobs = newJobs.filter(job => job.status === destination.droppableId);
    // let insertIndex = destination.index;

    const finalJobs = [...newJobs, updatedDraggedJob];
    setJobs(finalJobs);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        {/* Dark Mode Toggle Button */}
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
        </button>

        <Header
          addNewJob={addNewJob}
          newJob={newJob}
          setNewJob={setNewJob}
          search={search}
          setSearch={setSearch}
          error={error}
          setError={setError}
        />
        <main className="job-columns">
          {/* Render JobColumn for each status */}
          <JobColumn
            title="To Start" // Changed from "Need to Start" for consistency
            image={toDoIcon}
            alt="To-do icon"
            jobs={jobs}
            search={search}
            statusName="To Start" 
            updateJobStatus={updateJobStatus}
            onDeleteJob={onDeleteJob}
            onEditJob={onEditJob} 
            droppableId="To Start" // Droppable ID matches status name
            editingJob={editingJob}
            editForm={editForm} 
            handleEditFormChange={handleEditFormChange} 
            saveEdit={saveEdit} 
            cancelEdit={cancelEdit} 
            formError={error} 
          />

          <JobColumn
            title="In Progress"
            image={inProgressIcon}
            alt="In-progress icon"
            jobs={jobs}
            search={search}
            statusName="In Progress"
            updateJobStatus={updateJobStatus}
            onDeleteJob={onDeleteJob}
            onEditJob={onEditJob}
            droppableId="In Progress"
            editingJob={editingJob}
            editForm={editForm}
            handleEditFormChange={handleEditFormChange}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            formError={error}
          />

          <JobColumn
            title="Completed"
            image={doneIcon}
            alt="Done icon"
            jobs={jobs}
            search={search}
            statusName="Completed"
            updateJobStatus={updateJobStatus}
            onDeleteJob={onDeleteJob}
            onEditJob={onEditJob}
            droppableId="Completed"
            editingJob={editingJob}
            editForm={editForm}
            handleEditFormChange={handleEditFormChange}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            formError={error}
          />

        </main>
        <Footer />
      </div>
    </DragDropContext>
  );
}

export default App;