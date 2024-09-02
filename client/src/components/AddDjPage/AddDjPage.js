import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, InputGroup, Badge } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import './AddDjPage.css';

export default function AddDjPage() {
    const [name, setName] = useState('');
    const [produces, setProduces] = useState('');
    const [genreInput, setGenreInput] = useState('');
    const [genres, setGenres] = useState([]);
    const [subgenreInputs, setSubgenreInputs] = useState({});
    const [subgenres, setSubgenres] = useState({});
    const [venueInput, setVenueInput] = useState('');
    const [venues, setVenues] = useState([]);
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Fetch DJs for suggestions
    useEffect(() => {
        axios.get('/api/djs')
            .then(response => setSuggestions(response.data))
            .catch(err => console.error('Failed to fetch DJs', err));
    }, []);

    // Check DJ name existence on name change
    useEffect(() => {
        const checkDjExistence = () => {
            const checkCaseDjName = name.trim().toLowerCase();
            const dj = suggestions.find(dj => dj.name.toLowerCase() === checkCaseDjName);

            if (dj) {
                setError(`${dj.name} already exists`);
                setSuccess('');
            } else {
                setSuccess('Available');
                setError('');
            }
        };

        if (name.trim() !== '') {
            checkDjExistence();
        } else {
            setError('');
            setSuccess('');
        }
    }, [name, suggestions]);

    // Clear message after submit
    useEffect(() => {
        if (submitError || submitSuccess) {
            const timer = setTimeout(() => {
                setSubmitError('');
                setSubmitSuccess('');
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [submitError, submitSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear previous messages
        setSubmitError('');
        setSubmitSuccess('');
    
        try {
            await axios.post('/api/dj/add', {
                name,
                produces,
                genres,
                subgenres,
                venues,
                city,  // Include city in the submission
            });
            setSubmitSuccess(`${name} added successfully!`);
            handleClearForm();
        } catch (err) {
            setSubmitError(`Failed to add DJ. ${err.response?.data?.message || 'Error adding DJ.'}`);
        }
    };

    const handleAddGenre = () => {
        if (genreInput && !genres.includes(genreInput)) {
            setGenres([...genres, genreInput]);
            setSubgenres(prevSubgenres => ({ ...prevSubgenres, [genreInput]: [] }));
            setSubgenreInputs(prevInputs => ({ ...prevInputs, [genreInput]: '' }));
            setGenreInput('');
        }
    };

    const handleAddSubgenre = (genre) => {
        const subgenre = subgenreInputs[genre]?.trim();
        if (subgenre && !subgenres[genre]?.includes(subgenre)) {
            setSubgenres(prevSubgenres => ({
                ...prevSubgenres,
                [genre]: [...(prevSubgenres[genre] || []), subgenre]
            }));
            setSubgenreInputs(prevInputs => ({ ...prevInputs, [genre]: '' }));
        }
    };

    const handleSubgenreInputChange = (e, genre) => {
        setSubgenreInputs(prevInputs => ({ ...prevInputs, [genre]: e.target.value }));
    };

    const handleSubgenreRemove = (genre, index) => {
        setSubgenres(prevSubgenres => {
            const updatedSubgenres = { ...prevSubgenres };
            updatedSubgenres[genre] = updatedSubgenres[genre].filter((_, i) => i !== index);
            if (updatedSubgenres[genre].length === 0) {
                delete updatedSubgenres[genre];
            }
            return updatedSubgenres;
        });
    };

    const handleGenreRemove = (genre) => {
        setGenres(genres.filter(g => g !== genre));
        setSubgenres(prevSubgenres => {
            const updatedSubgenres = { ...prevSubgenres };
            delete updatedSubgenres[genre];
            return updatedSubgenres;
        });
        setSubgenreInputs(prevInputs => {
            const { [genre]: _, ...rest } = prevInputs;
            return rest;
        });
    };

    const handleAddVenue = () => {
        if (venueInput && !venues.includes(venueInput)) {
            setVenues([...venues, venueInput]);
            setVenueInput('');
        }
    };

    const handleVenueRemove = (venue) => {
        setVenues(venues.filter(v => v !== venue));
    };

    const handleClearForm = () => {
        setName('');
        setProduces('');
        setGenreInput('');
        setGenres([]);
        setSubgenres({});
        setSubgenreInputs({});
        setVenueInput('');
        setVenues([]);
        setCity(''); // Clear city input
        setError('');
        setSuccess('');
    };

    const isFormValid = () => {
        return name.trim() !== '' &&
               produces !== '' &&
               genres.length > 0 &&
               venues.length > 0 &&
               city.trim() !== '' && // Check city input
               success === 'Available' &&
               genres.every(genre => subgenres[genre] && subgenres[genre].length > 0); // Ensure each genre has at least one subgenre
    };

    return (
        <div className="tabcontent">
            <h1 className="white">Add New DJ</h1>
            <Container className="add-dj-container">
                <Form onSubmit={handleSubmit}>

                    {/* DJ Name */}
                    <Form.Group controlId="djName">
                        <Form.Label>DJ Name:</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <Form.Group className="form-messages">
                            {(error || success) && (
                                <div className={error ? "text-error" : "text-success"}>
                                    {error || success}
                                </div>
                            )}
                        </Form.Group>
                    </Form.Group>

                    {/* City */}
                    <Form.Group controlId="city">
                        <Form.Label>City:</Form.Label>
                        <Form.Control
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Music Production Status */}
                    <Form.Group controlId="producesMusic">
                        <Form.Label>Music Production Status:</Form.Label>
                        <Form.Control
                            as="select"
                            value={produces}
                            onChange={(e) => setProduces(e.target.value)}
                            required
                        >
                            <option value="" disabled>Please select an option</option>
                            <option value="No">Non-Producer</option>
                            <option value="Yes">Producer</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Genres */}
                    <Form.Group controlId="genres">
                        <Form.Label>Genres <br/> You must add at least 1 genre to submit DJ <br/>Each genre must have at least 1 subgenre</Form.Label>
                        <InputGroup className="mb-2">
                            <Form.Control
                                type="text"
                                value={genreInput}
                                onChange={(e) => setGenreInput(e.target.value)}
                                placeholder="Enter genre"
                            />
                            <Button variant="secondary" onClick={handleAddGenre}>Add Genre</Button>
                        </InputGroup>
                        {genres.map((genre, index) => (
                            <div key={index} className="genre-container mb-3">
                                <div className="genre-header">
                                    <span className="genre-title">{genre}</span>
                                    <Button variant="danger" onClick={() => handleGenreRemove(genre)}>
                                        <FaTimes />
                                    </Button>
                                </div>
                                <div className="subgenre-section">
                                    {subgenres[genre]?.map((subgenre, subIndex) => (
                                        <div key={subIndex} className="subgenre-item">
                                            {/* <Form.Label>Subgenres <br/> (You must add at least 1 subgenre of each genre to submit DJ):</Form.Label> */}
                                            <InputGroup className="mb-2">
                                                <Form.Control
                                                    type="text"
                                                    value={subgenre}
                                                    onChange={(e) => handleSubgenreInputChange(genre, subIndex, e.target.value)}
                                                    placeholder="Enter subgenre"
                                                    readOnly
                                                />
                                                <Button variant="danger" size="sm" onClick={() => handleSubgenreRemove(genre, subIndex)}>
                                                    <FaTimes />
                                                </Button>
                                            </InputGroup>
                                        </div>
                                    ))}
                                    <InputGroup className="mb-2">
                                        <Form.Control
                                            type="text"
                                            value={subgenreInputs[genre] || ''}
                                            onChange={(e) => handleSubgenreInputChange(e, genre)}
                                            placeholder="Add subgenre"
                                        />
                                        <Button variant="secondary" onClick={() => handleAddSubgenre(genre)}>Add Subgenre</Button>
                                    </InputGroup>
                                </div>
                            </div>
                        ))}
                    </Form.Group>

                    {/* Venues */}
                    <Form.Group controlId="venues">
                        <Form.Label>Venues (Add at least 1 venue):</Form.Label>
                        <InputGroup className="mb-2">
                            <Form.Control
                                type="text"
                                value={venueInput}
                                onChange={(e) => setVenueInput(e.target.value)}
                                placeholder="Enter venue"
                            />
                            <Button variant="secondary" onClick={handleAddVenue}>Add Venue</Button>
                        </InputGroup>
                        {venues.map((venue, index) => (
                            <Badge key={index} pill variant="secondary" className="me-2">
                                {venue}
                                <FaTimes className="ms-2" onClick={() => handleVenueRemove(venue)} />
                            </Badge>
                        ))}
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isFormValid()}
                    >
                        Add DJ
                    </Button>
                </Form>
                {submitSuccess && <div className="text-success">{submitSuccess}</div>}
                {submitError && <div className="text-error">{submitError}</div>}
            </Container>
        </div>
    );
}
