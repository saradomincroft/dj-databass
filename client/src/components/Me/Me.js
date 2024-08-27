import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilePictureEditor from '../ProfilePictureEditor/ProfilePictureEditor';
import './Me.css';

export default function Me() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showUsernameUpdate, setShowUsernameUpdate] = useState(false);

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

    const clearMessagesAfterTimeout = () => {
        setTimeout(() => {
            setError(null);
            setSuccessMessage(null);
        }, 2000);
    };

    const clearForms = () => {
        setUsername('');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };


    // const handleProfileImageChange = (e) => {
    //     setProfileImage(e.target.files[0]);
    // };

    // const handleProfileImageUpload = async () => {
    //     if (!profileImage) return;

    //     const formData = new FormData();
    //     formData.append('profileImage', profileImage);

    //     try {
    //         await axios.post('http://localhost:4000/api/me/upload', formData, { withCredentials: true });
    //         setSuccessMessage('Profile image uploaded successfully.');
    //         fetchUserData();
    //     } catch (error) {
    //         setError('Failed to upload profile image.');
    //         console.error('Error uploading profile image:', error);
    //     }
    // };

    // const handleProfileImageDelete = async () => {
    //     try {
    //         await axios.delete('http://localhost:4000/api/me/delete-profile-image', { withCredentials: true });
    //         setSuccessMessage('Profile image deleted successfully.');
    //         fetchUserData();
    //     } catch (error) {
    //         setError('Failed to delete profile image.');
    //         console.error('Error deleting profile image:', error);
    //     }
    // };

    const handleUsernameUpdate = async () => {
        if (!username.trim()) {
            setError('Username cannot be blank.');
            clearMessagesAfterTimeout();
            clearForms();
            return;
        }

        try {
            await axios.patch('http://localhost:4000/api/me', { username }, { withCredentials: true });
            setUsername('');
            setSuccessMessage('Username updated successfully.');
            fetchUserData();
            setShowUsernameUpdate(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setError('Username already exists.');
                } else if (error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError('Failed to update username.');
                }
            } else {
                setError('Failed to update username.');
            }
            console.error('Error updating username:', error);
            clearMessagesAfterTimeout();
            clearForms();
        }
    };

    const handlePasswordChange = async () => {
        if (!oldPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
            setError('Please fill out all password fields.');
            clearMessagesAfterTimeout();
            clearForms();
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            clearMessagesAfterTimeout();
            clearForms();
            return;
        }

        try {
            const response = await axios.patch('http://localhost:4000/api/me', 
                { oldPassword, newPassword }, 
                { withCredentials: true }
            );
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setSuccessMessage(response.data.message || 'Password updated successfully.');
            setShowPasswordForm(false);
            clearMessagesAfterTimeout();
            clearForms();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Old password is incorrect.');
                clearMessagesAfterTimeout();
                clearForms();
            } else {
                setError('Failed to change password.');
            }
            console.error('Error changing password:', error);
        }
    };

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
        setShowUsernameUpdate(false); // Ensure username update form is closed
        setError(null);
        setSuccessMessage(null);
    };

    const toggleUsernameUpdate = () => {
        setShowUsernameUpdate(!showUsernameUpdate);
        setShowPasswordForm(false); // Ensure password form is closed
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <div id="Me" className="tabcontent">
            <h1>{user ? user.username : 'Loading...'}</h1>

            {/* Profile Picture Section */}
            <ProfilePictureEditor user={user} fetchUserData={fetchUserData} />


            {/* Display Admin status (or blank for non-admins) */}
            <h2>{user?.is_admin ? 'Admin User' : ''}</h2>

            {/* Update Username Section */}
            <div className="update-username-section">
                {!showUsernameUpdate ? (
                    <button className="username-button" onClick={toggleUsernameUpdate}>Update Username</button>
                ) : (
                    <div className="username-form">
                        <input
                            type="text"
                            placeholder="New username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="username-input"
                        />
                        <button className="confirm-button" onClick={handleUsernameUpdate}>Submit</button>
                        <button className="cancel-button" onClick={toggleUsernameUpdate}>Cancel</button>
                    </div>
                )}
            </div>

            {/* Change Password Section */}
            <div className="update-password-section">
                {!showPasswordForm ? (
                    <button className="password-button" onClick={togglePasswordForm}>Update Password</button>
                ) : (
                    <div className="password-form">
                        <input
                            type="password"
                            placeholder="Old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <button className="confirm-button" onClick={handlePasswordChange}>Submit</button>
                        <button className="cancel-button" onClick={togglePasswordForm}>Cancel</button>
                    </div>
                )}
            </div>

            {/* Error and Success Messages */}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
}
