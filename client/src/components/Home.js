import React from 'react';

const Home = ({ onLogout }) => {
    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Home;
