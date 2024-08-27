import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Djs from '../Djs/Djs';
import './Home.css';

export default function Home({ onLogout }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/me', { withCredentials: true }); // Adjust the endpoint as needed
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div id="Home" className="tabcontent">
            <div className="header">
                <div className="profile-picture-section">
                    <img
                        src={user.profileImageUrl || '/img/default-profile.jpg'}
                        alt="Profile"
                        className="profile-picture"
                    />
                    <h1 className="white">Welcome, {user.username}</h1>
                </div>
                <button className="home-button" onClick={onLogout}>Logout</button>
            </div>

            <Djs />
        </div>
    );
}
