import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePictureEditor.css';

export default function ProfilePictureEditor({ user, fetchUserData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccessMessage(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage]);

    const handleProfileImageChange = (e) => {
        setProfileImage(e.target.files[0]);
        console.log('Selected File:', e.target.files[0]);
    };

    const handleProfileImageUpload = async () => {
        if (!profileImage) {
            setError('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', profileImage);

        try {
            console.log('Uploading File:', profileImage);
            const response = await axios.post('/api/me/user-profiles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            console.log('Upload Response:', response.data);
            setSuccessMessage('Profile image uploaded successfully.');
            await fetchUserData();
            setIsEditing(false);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to upload profile image.';
            setError(errorMessage);
            console.error('Error uploading profile image:', error);
        }
    };

    const handleProfileImageDelete = async () => {
        try {
            const response = await axios.delete('/api/me/delete-profile-image', { withCredentials: true });
            console.log('Delete Response:', response.data);
            setSuccessMessage('Profile image deleted successfully.');
            await fetchUserData();
            setIsEditing(false);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to delete profile image.';
            setError(errorMessage);
            console.error('Error deleting profile image:', error);
        }
    };

    return (
        <div className="profile-picture-container">
            <div className="profile-picture-img">
                <img
                    src={user?.profileImageUrl ? `/me/user-profiles/${user.profileImageUrl}?t=${new Date().getTime()}` : '/img/default-profile.jpg'}
                    alt="Profile"
                    className="profile-picture"
                />
                <div className="edit-icon" onClick={() => setIsEditing(true)}>
                    ✎
                </div>
            </div>

            {isEditing && (
                <div className="edit-popup">
                    <button className="close-button" onClick={() => setIsEditing(false)}>×</button>
                    <img
                        src={profileImage ? URL.createObjectURL(profileImage) : '/img/default-profile.jpg'}
                        alt="Profile Preview"
                        className="profile-picture"
                        style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                    />
                    <input type="file" onChange={handleProfileImageChange} />
                    <button className="profile-image-button" onClick={handleProfileImageUpload}>
                        Upload Profile Picture
                    </button>
                    <button className="profile-image-button" onClick={handleProfileImageDelete}>
                        Delete Profile Picture
                    </button>
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                </div>
            )}
        </div>
    );
}
