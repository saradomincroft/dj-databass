import React from 'react';
import Navbar from './Navbar';

const Home = ({ onLogout }) => {
    return (
        <div>
            <Navbar />
            <h1>Home Page</h1>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Home;
