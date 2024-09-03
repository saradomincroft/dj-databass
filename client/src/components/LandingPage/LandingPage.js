import React, { useState } from 'react';
import Login from '../LoginSignup/Login';
import Signup from '../LoginSignup/Signup';
import './LandingPage.css'

export default function LandingPage({ onLogin, onSignup }) {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div className='tabcontent'>
            <div className="landing-page-container">
                <h1>Welcome to the DJ Databass</h1>
                {isSignup ? (
                    <>
                        <Signup onSignup={onSignup} />
                        <p>
                            Already have an account? <button onClick={() => setIsSignup(false)}>Log In</button>
                        </p>
                    </>
                ) : (
                    <>
                        <Login onLogin={onLogin} />
                        <p>
                            Don't have an account? <button onClick={() => setIsSignup(true)}>Sign Up</button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
