import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DjProfilePictureEditor from '../DjProfilePictureEditor/DjProfilePictureEditor';
import './DjPage.css';

export default function DjPage() {
    const { dj_id } = useParams();
    const navigate = useNavigate();
    const [dj, setDj] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [favourites, setFavourites] = useState([]);

    // Function to fetch DJ data and user data
    const fetchData = async () => {
        try {
            const [djResponse, userResponse] = await Promise.all([
                axios.get(`/api/dj/${dj_id}`),
                axios.get('/api/me', { withCredentials: true })
            ]);
            setDj(djResponse.data);
            setUser(userResponse.data);
            setFavourites(userResponse.data.favourites || []);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please check the console for more details.');
        }
    };

    useEffect(() => {
        fetchData();
    }, [dj_id]);

    // Toggle favourite function
    const handleToggleFavourite = async () => {
        try {
            const isFavourite = favourites.some(fav => fav.id === dj.id);
            if (isFavourite) {
                await axios.delete('/api/me/favourites', { data: { dj_id: dj.id }, withCredentials: true });
                setFavourites(prevFavourites => prevFavourites.filter(fav => fav.id !== dj.id));
            } else {
                await axios.post('/api/me/favourites', { dj_id: dj.id }, { withCredentials: true });
                setFavourites(prevFavourites => [...prevFavourites, dj]);
            }
        } catch (error) {
            console.error('Error updating favourites:', error);
            setError('Error updating favourites.');
        }
    };

    const isFavourite = () => favourites.some(fav => fav.id === dj.id);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this DJ?')) {
            try {
                await axios.delete(`/api/dj/${dj_id}`, { withCredentials: true });
                navigate('/home');
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
                <div className="dj-header">
                    <h1 className="dj-name">{dj.name}</h1>
                    {/* Favourite/Unfavourite button */}
                    <button className="btn heart-container" onClick={handleToggleFavourite}>
                        <span className={`favourite-icon ${isFavourite() ? 'filled' : ''}`}>
                            {isFavourite() ? '❤️' : '♡'}
                        </span>
                    </button>
                </div>
                <p><strong>City:</strong> {dj.city || 'N/A'}</p>
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
