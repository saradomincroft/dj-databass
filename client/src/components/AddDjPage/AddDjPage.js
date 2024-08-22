import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, InputGroup, Badge } from 'react-bootstrap';
import './AddDjPage.css';

export default function AddDjPage() {
    const [name, setName] = useState('');
    const [produces, setProduces] = useState(false);
    const [genreInput, setGenreInput] = useState('');
    const [genres, setGenres] = useState([]);
    const [subgenres, setSubgenres] = useState({});
    const [venueInput, setVenueInput] = useState('');
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        axios.get('/api/djs')
            .then(response => setSuggestions(response.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const checkDjExistence = () => {
        if (name.trim() === '') {
            setError('Please enter a DJ name.');
            return;
        }

        const normalizedInputName = name.trim().toLowerCase();
        const exists = suggestions.some(dj => dj.name.toLowerCase() === normalizedInputName);
        
        if (exists) {
            setError('DJ already exists');
        } else {
            setSuccess('Available')
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (error === 'DJ already exists') {
        //     return;
        // }

        if (!name.trim() || genres.length === 0 || venues.length === 0) {
            setError('Please fill out all required fields.');
            return;
        }

        for (const genre of genres) {
            if (!subgenres[genre] || subgenres[genre].length === 0) {
                setError(`Each genre must have at least one subgenre. Please add subgenres for the genre "${genre}".`);
                return;
            }
        }

        try {
            await axios.post('/api/dj/add', {
                name,
                produces,
                genres,
                subgenres,
                venues,
            });
            setSuccess('DJ added successfully!');
            handleClearForm();
        } catch (err) {
            setError('Failed to add DJ.');
        }
    };

    const handleAddGenre = () => {
        if (genreInput && !genres.includes(genreInput)) {
            setGenres([...genres, genreInput]);
            setSubgenres({ ...subgenres, [genreInput]: [] });
            setGenreInput('');
        }
    };

    const handleAddSubgenre = (genre) => {
        setSubgenres({
            ...subgenres,
            [genre]: [...subgenres[genre], '']
        });
    };

    const handleSubgenreChange = (genre, index, value) => {
        const updatedSubgenres = { ...subgenres };
        updatedSubgenres[genre][index] = value;
        setSubgenres(updatedSubgenres);
    };

    const handleRemoveSubgenre = (genre, index) => {
        const updatedSubgenres = { ...subgenres };
        updatedSubgenres[genre] = updatedSubgenres[genre].filter((_, i) => i !== index);
        if (updatedSubgenres[genre].length === 0) {
            delete updatedSubgenres[genre];
        }
        setSubgenres(updatedSubgenres);
    };

    const handleGenreRemove = (genre) => {
        const updatedGenres = genres.filter(g => g !== genre);
        const updatedSubgenres = { ...subgenres };
        delete updatedSubgenres[genre];
        setGenres(updatedGenres);
        setSubgenres(updatedSubgenres);
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
        setProduces(false);
        setGenreInput('');
        setGenres([]);
        setSubgenres({});
        setVenueInput('');
        setVenues([]);
        setError('');
        setSuccess('');
    };

    return (
        <div className="tabcontent">
            <Container className="add-dj-container">
                <h1>Add DJ</h1>
                <Form onSubmit={handleSubmit}>

                    {/* Add DJ name, check if blank, check if exists in database */}
                    <Form.Group controlId="djName">
                        <Form.Label>DJ Name:</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Button variant="secondary" onClick={checkDjExistence}>Check DJ</Button>
                        </InputGroup>
                        <Form.Group className="form-messages">
                            {(error || success) && (
                                <div className={error ? "text-error": "text-success"}>
                                    {error || success}
                                </div>
                            )}
                        </Form.Group>
                    </Form.Group>
                    




                    <Form.Group controlId="producesMusic">
                        <Form.Check 
                            type="checkbox" 
                            label="Produces Music?" 
                            checked={produces}
                            onChange={(e) => setProduces(e.target.checked)}
                        />
                    </Form.Group>

                    <Form.Group controlId="genres">
                        <Form.Label>Genres:</Form.Label>
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
                            <div key={index} className="mb-2">
                                <Badge pill bg="primary" className="me-2">{genre}</Badge>
                                <Button variant="danger" size="sm" onClick={() => handleGenreRemove(genre)}>Remove</Button>
                                <Button variant="secondary" size="sm" className="ms-2" onClick={() => handleAddSubgenre(genre)}>Add Subgenre</Button>
                                {subgenres[genre] && subgenres[genre].map((subgenre, subIndex) => (
                                    <InputGroup key={subIndex} className="mb-1 mt-1">
                                        <Form.Control
                                            type="text"
                                            value={subgenre}
                                            onChange={(e) => handleSubgenreChange(genre, subIndex, e.target.value)}
                                            placeholder="Enter subgenre"
                                        />
                                        <Button variant="danger" size="sm" onClick={() => handleRemoveSubgenre(genre, subIndex)}>Remove Subgenre</Button>
                                    </InputGroup>
                                ))}
                            </div>
                        ))}
                    </Form.Group>

                    <Form.Group controlId="venues">
                        <Form.Label>Venues:</Form.Label>
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
                            <div key={index} className="mb-2">
                                <Badge pill bg="primary" className="me-2">{venue}</Badge>
                                <Button variant="danger" size="sm" onClick={() => handleVenueRemove(venue)}>Remove</Button>
                            </div>
                        ))}
                    </Form.Group>



                    <Button variant="primary" type="submit">Add DJ</Button>
                    <Button variant="secondary" onClick={handleClearForm} className="ms-2">Clear Form</Button>
                </Form>
            </Container>
        </div>
    );
}
