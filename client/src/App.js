import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage/LandingPage';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Signup from './components/LoginSignup/Signup';
import Me from './components/Me/Me';
import AddDjPage from './components/AddDjPage/AddDjPage';
import Djs from './components/Djs/Djs';
import DjPage from './components/DjPage/DjPage';
import UpdateDj from './components/UpdateDj/UpdateDj';
import Favourites from './components/Favourites/Favourites';

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
        const authStatus = sessionStorage.getItem('isAuthenticated') === 'true';
        const userData = sessionStorage.getItem('userData');
        
        console.log("Checking authentication status...");
        console.log("authStatus:", authStatus);
        console.log("userData:", userData);

        if (authStatus && userData) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogin = (userData) => {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthenticated(true);
        console.log("User logged in. Authenticated:", true);
    };

    const handleSignup = (userData) => {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthenticated(true);
        console.log("User signed up. Authenticated:", true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userData');
        setIsAuthenticated(false);
        console.log("User logged out. Authenticated:", false);
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
                            path="/dj/update/:dj_id"
                            element={isAuthenticated ? <UpdateDj /> : <Navigate to="/" />}
                        />

                        <Route
                            path="/me"
                            element={isAuthenticated ? <Me /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/favourites"
                            element={isAuthenticated ? <Favourites /> : <Navigate to="/" />}
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
