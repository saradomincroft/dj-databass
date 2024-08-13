import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Signup';
import AddDjPage from './components/AddDjPage';
import Djs from './components/Djs';
import DjPage from './components/DjPage';
// import UpdateDjPage from './components/UpdateDjPage'; // Assuming you'll have this component

function Layout({ children }) {
    const location = useLocation();
    return (
        <>
            {location.pathname !== '/' && <Navbar />}
            {children}
        </>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check local storage for authentication status
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
                        {/* Remove duplicate route */}
                        {/* <Route
                            path="/dj/:id"
                            element={isAuthenticated ? <DjPage /> : <Navigate to="/" />}
                        /> */}
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
