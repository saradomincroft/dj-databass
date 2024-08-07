import React from 'react';

export default function Home({ onLogout }) {
    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}
