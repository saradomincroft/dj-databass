import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Me.css';

export default function Me() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

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

    const handleProfileImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleProfileImageUpload = async () => {
        if (!profileImage) return;

        const formData = new FormData();
        formData.append('profileImage', profileImage);

        try {
            await axios.post('http://localhost:4000/api/me/upload', formData, { withCredentials: true });
            setSuccessMessage('Profile image uploaded successfully.');
            fetchUserData();
        } catch (error) {
            setError('Failed to upload profile image.');
            console.error('Error uploading profile image:', error);
        }
    };

    const handleProfileImageDelete = async () => {
        try {
            await axios.delete('http://localhost:4000/api/me/delete-profile-image', { withCredentials: true });
            setSuccessMessage('Profile image deleted successfully.');
            fetchUserData();
        } catch (error) {
            setError('Failed to delete profile image.');
            console.error('Error deleting profile image:', error);
        }
    };

    const handleUsernameUpdate = async () => {
        if (!username.trim()) return;

        try {
            await axios.put('http://localhost:4000/api/me', { username }, { withCredentials: true });
            setUsername('');
            setSuccessMessage('Username updated successfully.');
            fetchUserData();
        } catch (error) {
            setError('Failed to update username.');
            console.error('Error updating username:', error);
        }
    };

    const handlePasswordChange = async () => {
        if (!oldPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
            setError('Please fill out all password fields.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
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
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Old password is incorrect.');
            } else {
                setError('Failed to change password.');
            }
            console.error('Error changing password:', error);
        }
    };

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
        setError(null);
        setSuccessMessage(null);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div id="Me" className="tabcontent">
            <h1>User Information</h1>

            {/* Profile Picture Section */}
            <div className="profile-picture-section">
                <img
                    src={user.profileImageUrl || '/img/default-profile.jpg'}
                    alt="Profile Image"
                    className="profile-picture"
                />
                <div className="profile-picture-actions">
                    <input type="file" onChange={handleProfileImageChange} />
                    <button onClick={handleProfileImageUpload}>Upload Profile Picture</button>
                    <button onClick={handleProfileImageDelete}>Delete Profile Picture</button>
                </div>
            </div>

            {/* User Info */}
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Admin Status:</strong> {user.is_admin ? 'Yes' : 'No'}</p>

            {/* Update Username Section */}
            <div className="update-username-section">
                <input
                    type="text"
                    placeholder="New username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={handleUsernameUpdate}>Update Username</button>
            </div>

            {/* Change Password Section */}
            <div className="change-password-section">
                <button onClick={togglePasswordForm}>
                    {showPasswordForm ? 'Cancel' : 'Update Password'}
                </button>

                {showPasswordForm && (
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
                        <button onClick={handlePasswordChange}>Submit</button>
                    </div>
                )}
            </div>

            {/* Error and Success Messages */}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
}
