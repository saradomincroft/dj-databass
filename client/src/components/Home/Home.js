import React from 'react';
import './Home.css';

export default function Home({ onLogout }) {
  return (
    <div id="Home" className="tabcontent">
      <div>
        <h1 className="white">Home Page</h1>
        <button className="home-button" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
