import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DjPage.css';

export default function DjPage() {
    const { dj_id } = useParams();
    const navigate = useNavigate();
    const [dj, setDj] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch DJ details
                const djResponse = await axios.get(`/api/dj/${dj_id}`);
                setDj(djResponse.data);

                // Fetch user details to check admin status
                const userResponse = await axios.get('/api/me', { withCredentials: true });
                setUser(userResponse.data);

                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please check the console for more details.');
            }
        };

        fetchData();
    }, [dj_id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this DJ?')) {
            try {
                await axios.delete(`/api/dj/${dj_id}`, { withCredentials: true });
                navigate('/djs');
            } catch (error) {
                console.error('Error deleting DJ:', error);
                setError('Error deleting DJ. Please check the console for more details.');
            }
        }
    };

    const handleUpdate = () => {
        navigate(`/dj/update/${dj_id}`);
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!dj) return <p className="loading-message">Loading...</p>;

    return (
        <div className="tabcontent">
        <div className="dj-page">
            <h1 className="dj-name">{dj.name}</h1>
            <p><strong>Music Producer:</strong> {dj.produces ? 'Yes' : 'No'}</p>
                <h2>Genres and Subgenres</h2>
                {dj.genres.length > 0 ? (
                    <div className="genres">
                        {dj.genres.map((genre) => (
                            <div key={genre} className="genre-section">
                                <h3>{genre}</h3>
                                <ul className="subgenres">
                                    {dj.subgenres[genre] ? (
                                        dj.subgenres[genre].map((subgenre, index) => (
                                            <li key={index}>{subgenre}</li>
                                        ))
                                    ) : (
                                        <li>No subgenres</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : 'N/A'}
            <p><strong>Venues:</strong> {dj.venues.length > 0 ? dj.venues.join(', ') : 'N/A'}</p>
            
            {/* Conditionally render Update and Delete buttons based on admin status */}
            {user && user.is_admin && (
                <div className="admin-controls">
                    <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
        </div>
    );
}
