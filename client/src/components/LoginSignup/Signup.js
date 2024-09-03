import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onSignup, onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const signupResponse = await axios.post('http://localhost:4000/api/signup', {
                username,
                password,
                is_admin: isAdmin
            });

            console.log(signupResponse.data);

            const loginResponse = await axios.post('http://localhost:4000/api/login', 
            { username, password }, 
            { withCredentials: true });
            
            if (loginResponse.data.token) {
                localStorage.setItem('token', loginResponse.data.token);
            }

            if (onSignup) {
                onSignup();
            }

            if (onLogin) {
                onLogin(); // Notify App that login was successful
            }

            navigate('/home');
        } catch (err) {
            setError('Signup failed: ' + (err.response?.data?.error || 'Unknown error'));
            console.error(err);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Signup</h2>
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
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    Admin
                </label>
                <button type="submit">Signup</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}
