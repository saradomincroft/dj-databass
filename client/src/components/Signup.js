// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';

export default function Signup({ onSignup }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/signup', {
                username,
                password,
                is_admin: isAdmin,
                admin_password: isAdmin ? adminPassword : undefined
            });
            console.log(response.data);
            if (onSignup) {
                onSignup(); // Notify App that signup was successful
            }
        } catch (err) {
            setError('Signup failed');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    Admin
                </label>
                {isAdmin && (
                    <>
                        <br />
                        <label>
                            Admin Password:
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                            />
                        </label>
                    </>
                )}
                <br />
                <button type="submit">Signup</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}
