import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Signup from './components/Signup';
import Me from './components/Me/Me';
import AddDjPage from './components/AddDjPage/AddDjPage';
import Djs from './components/Djs/Djs';
import DjPage from './components/DjPage';


function Layout({ children }) {
    const location = useLocation();
    return (
        <>
            {location.pathname !== '/' && <Navigation />}
            {children}
        </>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(authStatus === 'true');
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
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="App">
                <Layout>
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
                        <Route
                            path="/add-dj"
                            element={isAuthenticated ? <AddDjPage /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/djs"
                            element={isAuthenticated ? <Djs /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/dj/:dj_id"
                            element={isAuthenticated ? <DjPage /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/me"
                            element={isAuthenticated ? <Me /> : <Navigate to="/" />}
                        />
                        <Route
                            path="*"
                            element={<h1>404 - Not Found</h1>}
                        />
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}
