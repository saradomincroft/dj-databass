import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Me() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/me', { withCredentials: true });
            setUser(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching user data. Please make sure you are logged in.');
            console.error('Error fetching user data:', error);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Information</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Admin Status:</strong> {user.is_admin ? 'Yes' : 'No'}</p>
        </div>
    );
}
