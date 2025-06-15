import React from 'react';
import Logo from "../images/job-board-app-pic.png";
// import './AppForm.css'; // Ensure this path is correct for form styles

export const Header = () => {
  return (
    <header className="header-top">
      <h1>
        <img className="object-fit-contain" height="100" width="auto" src={Logo} alt="Job Board Application" />
        <a href="/">Job Management Application</a>
      </h1>
    </header>
  );
};