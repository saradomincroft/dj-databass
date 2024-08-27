// ProfilePictureEditor.js
import React, { useState } from 'react';
import axios from 'axios';
import './ProfilePictureEditor.css';

export default function ProfilePictureEditor({ user, fetchUserData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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
            setIsEditing(false);
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
            setIsEditing(false);
        } catch (error) {
            setError('Failed to delete profile image.');
            console.error('Error deleting profile image:', error);
        }
    };

    return (
        <div className="profile-picture-container">
            <div className="profile-picture-img">
            <img
                src={user?.profileImageUrl || '/img/default-profile.jpg'}
                alt="Profile"
                className="profile-picture"
            />
            <div className="edit-icon" onClick={() => setIsEditing(true)}>
                ✎
            </div>
            </div>
            
            {isEditing && (
                <div className="edit-popup">
                    <input type="file" onChange={handleProfileImageChange} />
                    <button className="profile-image-button" onClick={handleProfileImageUpload}>
                        Upload Profile Picture
                    </button>
                    <button className="profile-image-button" onClick={handleProfileImageDelete}>
                        Delete Profile Picture
                    </button>
                    <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                </div>
            )}
        </div>
    );
}
