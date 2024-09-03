import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Badge, InputGroup, Row, Col } from 'react-bootstrap';
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
    const [newGenre, setNewGenre] = useState('');
    const [newSubgenre, setNewSubgenre] = useState('');
    const [newVenue, setNewVenue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const djResponse = await axios.get(`/api/dj/${dj_id}`);
                setDjData(djResponse.data);
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

    const handleAddGenre = () => {
        if (newGenre && !djData.subgenres[newGenre]) {
            setDjData(prevData => ({
                ...prevData,
                subgenres: {
                    ...prevData.subgenres,
                    [newGenre]: []
                }
            }));
            setNewGenre('');
        }
    };

    const handleAddSubgenre = (genre) => {
        const subgenre = newSubgenre.trim();
        if (subgenre && !djData.subgenres[genre]?.includes(subgenre)) {
            setDjData(prevData => ({
                ...prevData,
                subgenres: {
                    ...prevData.subgenres,
                    [genre]: [...(prevData.subgenres[genre] || []), subgenre]
                }
            }));
            setNewSubgenre('');
        }
    };

    const handleAddVenue = () => {
        if (newVenue) {
            setDjData(prevData => ({
                ...prevData,
                venues: [...prevData.venues, newVenue]
            }));
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

    const handleRemoveGenre = (genre) => {
        setDjData(prevData => {
            const { [genre]: _, ...rest } = prevData.subgenres;
            return {
                ...prevData,
                subgenres: rest
            };
        });
    };

    const handleRemoveVenue = (index) => {
        setDjData(prevData => ({
            ...prevData,
            venues: prevData.venues.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        return Object.keys(djData.subgenres).length > 0 || djData.venues.length > 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setError('Please add at least one subgenre or venue.');
            return;
        }
        
        try {
            console.log('Attempting to update DJ...');
            const response = await axios.patch(`/api/dj/update/${dj_id}`, djData, { withCredentials: true });
            console.log('Update successful:', response.data);
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
        <div className="tabcontent">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="secondary" onClick={() => navigate(`/dj/${dj_id}`)}>Return to DJ Page</Button>
                    <h1>Update DJ Information</h1>
                </div>

                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="name">
                        <Form.Label className="form-label">Name</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                name="name"
                                value={djData.name}
                                onChange={handleInputChange}
                                placeholder="Enter DJ name"
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="city" className="mt-3">
                        <Form.Label className="form-label">City</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                name="city"
                                value={djData.city}
                                onChange={handleInputChange}
                                placeholder="Enter DJ city"
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="produces" className="mt-3">
                        <Form.Check
                            type="checkbox"
                            name="produces"
                            checked={djData.produces}
                            onChange={handleInputChange}
                            label="Music Producer"
                        />
                    </Form.Group>

                    <Form.Group controlId="genre" className="mt-3">
                        <Form.Label className="form-label">Genres</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={newGenre}
                                onChange={(e) => setNewGenre(e.target.value)}
                                placeholder="Enter new genre"
                            />
                            <Button variant="secondary" onClick={handleAddGenre}>Add Genre</Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="subgenres" className="mt-3">
                        {Object.entries(djData.subgenres).map(([genre, subgenres]) => (
                            <div key={genre} className="genre-section mt-3">
                                <Row>
                                    <Col xs={9}>
                                        <h5>{genre}</h5>
                                    </Col>
                                    <Col xs={3} className="text-end">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveGenre(genre)}
                                        >
                                            Remove Genre
                                        </Button>
                                    </Col>
                                </Row>
                                <ul className="subgenres">
                                    {subgenres.map((subgenre, index) => (
                                        <li key={index} className="d-flex align-items-center">
                                            {subgenre}
                                            <Button
                                                variant="link"
                                                onClick={() => handleRemoveSubgenre(genre, index)}
                                                className="remove-subgenre ms-2"
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
                                        onChange={(e) => setNewSubgenre(e.target.value)}
                                        placeholder="Enter subgenre"
                                    />
                                    <Button variant="secondary" onClick={() => handleAddSubgenre(genre)}>Add Subgenre</Button>
                                </InputGroup>
                            </div>
                        ))}
                    </Form.Group>

                    <Form.Group controlId="venues" className="mt-3">
                        <Form.Label className="form-label">Venues</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={newVenue}
                                onChange={(e) => setNewVenue(e.target.value)}
                                placeholder="Enter new venue"
                            />
                            <Button variant="secondary" onClick={handleAddVenue}>Add Venue</Button>
                        </InputGroup>
                        <ul className="venues mt-2">
                            {djData.venues.map((venue, index) => (
                                <li key={index} className="d-flex align-items-center">
                                    {venue}
                                    <Button
                                        variant="link"
                                        onClick={() => handleRemoveVenue(index)}
                                        className="remove-venue ms-2"
                                    >
                                        <FaTimes />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </Form.Group>


                    <Form.Group className="mt-4">
                        <Button variant="primary" type="submit">Update DJ</Button>
                        <Button variant="danger" className="ms-3" onClick={handleDelete}>Delete DJ</Button>
                    </Form.Group>
                </Form>

                {success && <p className="success-message">{success}</p>}
            </Container>
        </div>
    );
}
