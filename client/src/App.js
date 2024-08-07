import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';  
import Home from './components/Home';
import Signup from './components/Signup';
import AddDjPage from './components/AddDjPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check local storage for authentication status
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const handleSignup = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage onLogin={handleLogin} onSignup={handleSignup} />}
                    />
                    <Route
                        path="/home"
                        element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/signup"
                        element={isAuthenticated ? <Navigate to="/home" /> : <Signup onSignup={handleSignup} />}
                    />
                    <Route path="/add-dj" element={<AddDjPage />} />
                    <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
