import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DjProfilePictureEditor from '../DjProfilePictureEditor/DjProfilePictureEditor';
import { Container, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import './UpdateDj.css';

export default function UpdateDj() {
    const { dj_id } = useParams();
    const navigate = useNavigate();
    const [djData, setDjData] = useState({
        name: '',
        genre: '',
        subgenres: {},
        venues: [],
        city: '',
        produces: false
    });
    const [newSubgenre, setNewSubgenre] = useState('');
    const [newVenue, setNewVenue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const djResponse = await axios.get(`/api/dj/${dj_id}`);
                setDjData(djResponse.data);

                // Removed the unnecessary setUser call
                // const userResponse = await axios.get('/api/me', { withCredentials: true });
                // setUser(userResponse.data);

                setError('');
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please check the console for more details.');
            }
        };

        fetchData();
    }, [dj_id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDjData({
            ...djData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubgenreChange = (e) => {
        setNewSubgenre(e.target.value);
    };

    const handleVenueChange = (e) => {
        setNewVenue(e.target.value);
    };

    const handleAddSubgenre = () => {
        if (newSubgenre) {
            setDjData(prevData => ({
                ...prevData,
                subgenres: {
                    ...prevData.subgenres,
                    [prevData.genre]: [...(prevData.subgenres[prevData.genre] || []), newSubgenre]
                }
            }));
            setNewSubgenre('');
        }
    };

    const handleAddVenue = () => {
        if (newVenue) {
            setDjData({
                ...djData,
                venues: [...djData.venues, newVenue]
            });
            setNewVenue('');
        }
    };

    const handleRemoveSubgenre = (genre, index) => {
        setDjData(prevData => ({
            ...prevData,
            subgenres: {
                ...prevData.subgenres,
                [genre]: prevData.subgenres[genre].filter((_, i) => i !== index)
            }
        }));
    };

    const handleRemoveVenue = (index) => {
        setDjData({
            ...djData,
            venues: djData.venues.filter((_, i) => i !== index)
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/dj/${dj_id}`, djData,
                { withCredentials: true });
                setSuccess('DJ updated successfully');
                setError('');
                navigate(`/dj/${dj_id}`);
            } catch (error) {
                console.error('Error updating DJ:', error);
                setError('Error updating DJ. Please check the console for more details.');
                setSuccess('');
            }
        };
    
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
    
        if (error) return <p className="error-message">{error}</p>;
        if (!djData) return <p className="loading-message">Loading...</p>;
    
        return (
            <Container>
                <h1>Update DJ Information</h1>
                <DjProfilePictureEditor dj={djData} fetchDjData={() => setDjData(djData)} />
    
                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={djData.name}
                            onChange={handleInputChange}
                            placeholder="Enter DJ name"
                            required
                        />
                    </Form.Group>
    
                    <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={djData.city}
                            onChange={handleInputChange}
                            placeholder="Enter DJ city"
                        />
                    </Form.Group>
    
                    <Form.Group controlId="produces">
                        <Form.Check
                            type="checkbox"
                            name="produces"
                            checked={djData.produces}
                            onChange={handleInputChange}
                            label="Music Producer"
                        />
                    </Form.Group>
    
                    <Form.Group controlId="genre">
                        <Form.Label>Genre</Form.Label>
                        <Form.Control
                            type="text"
                            name="genre"
                            value={djData.genre}
                            onChange={handleInputChange}
                            placeholder="Enter DJ genre"
                        />
                    </Form.Group>
    
                    <Form.Group controlId="subgenres">
                        <Form.Label>Subgenres</Form.Label>
                        {Object.keys(djData.subgenres).map(genre => (
                            <div key={genre} className="genre-section">
                                <h3>{genre}</h3>
                                <ul className="subgenres">
                                    {djData.subgenres[genre].map((subgenre, index) => (
                                        <li key={index}>
                                            {subgenre}
                                            <Button
                                                variant="link"
                                                onClick={() => handleRemoveSubgenre(genre, index)}
                                                className="remove-subgenre"
                                            >
                                                <FaTimes />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                <InputGroup className="mb-2">
                                    <Form.Control
                                        type="text"
                                        value={newSubgenre}
                                        onChange={handleSubgenreChange}
                                        placeholder="Enter subgenre"
                                    />
                                    <Button variant="secondary" onClick={handleAddSubgenre}>Add Subgenre</Button>
                                </InputGroup>
                            </div>
                        ))}
                    </Form.Group>
    
                    <Form.Group controlId="venues">
                        <Form.Label>Venues</Form.Label>
                        {djData.venues.map((venue, index) => (
                            <div key={index} className="venue-badge">
                                <Badge bg="secondary">
                                    {venue}
                                    <Button
                                        variant="link"
                                        onClick={() => handleRemoveVenue(index)}
                                        className="remove-venue"
                                    >
                                        <FaTimes />
                                    </Button>
                                </Badge>
                            </div>
                        ))}
                        <InputGroup className="mb-2">
                            <Form.Control
                                type="text"
                                value={newVenue}
                                onChange={handleVenueChange}
                                placeholder="Enter venue"
                            />
                            <Button variant="secondary" onClick={handleAddVenue}>Add Venue</Button>
                        </InputGroup>
                    </Form.Group>
    
                    <Button variant="primary" type="submit">Update DJ</Button>
                    <Button variant="danger" onClick={handleDelete} className="ms-2">Delete DJ</Button>
    
                    {error && <div className="text-error mt-3">{error}</div>}
                    {success && <div className="text-success mt-3">{success}</div>}
                </Form>
            </Container>
        );
    }
    