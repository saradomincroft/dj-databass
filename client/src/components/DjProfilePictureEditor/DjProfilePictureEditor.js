import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DjProfilePictureEditor.css';

export default function DjProfilePictureEditor({ dj, fetchDjData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
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
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileImageUpload = async () => {
        if (!profileImage) {
            setError('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', profileImage);

        try {
            const response = await axios.post(`/api/dj/${dj.id}/dj-profiles`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            setSuccessMessage('Profile image uploaded successfully.');
            await fetchDjData(); 
            setIsEditing(false);
            setPreviewImage(null);
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.response?.data?.error || 'Failed to upload profile image.');
        }
    };

    const handleProfileImageDelete = async () => {
        try {
            const response = await axios.delete(`/api/dj/${dj.id}/delete-profile-image`, { withCredentials: true });
            setSuccessMessage('Profile image deleted successfully.');
            await fetchDjData();
            setIsEditing(false);
        } catch (error) {
            console.error('Delete error:', error);
            setError(error.response?.data?.error || 'Failed to delete profile image.');
        }
    };

    return (
        <div className="profile-picture-container">
            <div className="profile-picture-img">
                <img
                    src={dj?.dj_profile_picture ? `/dj-profiles/${dj.dj_profile_picture}` : '/img/default-profile.jpg'}
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
                        src={previewImage || (dj?.dj_profile_picture ? `/dj-profiles/${dj.profile_image_url}` : '/img/default-profile.jpg')}
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
