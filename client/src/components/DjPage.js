import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                const userResponse = await axios.get('http://localhost:4000/api/me', { withCredentials: true });
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
            
            {/* Conditionally render Update and Delete buttons based on admin status */}
            {user && user.is_admin && (
                <div>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
            
            <button onClick={() => navigate('/djs')}>Back to DJs</button>
        </div>
    );
}