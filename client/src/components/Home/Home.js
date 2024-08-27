import React from 'react';
import Djs from '../Djs/Djs';
import './Home.css';

export default function Home({ onLogout, userId }) {
    return (
        <div id="Home" className="tabcontent">
            <div className="header">
                <h1 className="white">Home Page</h1>
                <button className="home-button" onClick={onLogout}>Logout</button>
            </div>

            <Djs userId={userId} />

        </div>
    );
}
