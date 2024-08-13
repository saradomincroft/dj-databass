import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DjPage() {
    const { dj_id } = useParams();
    const navigate = useNavigate();
    const [dj, setDj] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch DJ details
                const response = await axios.get(`/api/dj/${dj_id}`);
                setDj(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching DJ details:', error);
                setError('Error fetching DJ details. Please check the console for more details.');
            }
        };

        fetchData();
    }, [dj_id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this DJ?')) {
            try {
                await axios.delete(`/api/dj/${dj_id}`);
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

    if (error) return <p>{error}</p>;
    if (!dj) return <p>Loading...</p>;

    return (
        <div>
            <h1>{dj.name}</h1>
            <p><strong>Genres:</strong> {dj.genres ? dj.genres.join(', ') : 'N/A'}</p>
            <div>
                <strong>Subgenres:</strong>
                {dj.subgenres && Object.keys(dj.subgenres).length > 0 ? (
                    <ul>
                        {Object.entries(dj.subgenres).map(([genre, subgenreGroup]) => (
                            <li key={genre}>
                                <strong>{genre}:</strong>
                                <ul>
                                    {subgenreGroup.map((subgenre, index) => (
                                        <li key={index}>{subgenre}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>N/A</p>
                )}
            </div>
            <p><strong>Venues:</strong> {dj.venues ? dj.venues.join(', ') : 'N/A'}</p>
            <div>
                <button onClick={handleUpdate}>Update</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
            <button onClick={() => navigate('/djs')}>Back to DJs</button>
        </div>
    );
}
