import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css'

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/login', 
            { username, password }, 
            { withCredentials: true });


            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            if (onLogin) {
                onLogin(); 
            }
            navigate('/home');
        } catch (err) {

            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Login</h2>
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
                {error && <p>{error}</p>}

                <button type="submit">Login</button>
            </form>

        </div>
    );
}
