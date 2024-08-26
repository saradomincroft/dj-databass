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
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // To check input against list of current DJs
    useEffect(() => {
        axios.get('/api/djs')
            .then(response => setSuggestions(response.data))
            .catch(err => console.error('Failed to fetch DJs', err));
    }, []);

    // Timeout for error/ success messages
    useEffect(() => {
        if (error || success || submitError || submitSuccess) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
                setSubmitError('');
                setSubmitSuccess('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error, success, submitError, submitSuccess]);

    // Check if DJ name input field blank/ white space, check if DJ already exists in database
    // Returns error/ success messages
    const checkDjExistence = () => {
        if (name.trim() === '') {
            setError('Please enter a DJ name.');
            return;
        }

        // checks if DJ in database even if user types different case
        const checkCaseDjName = name.trim().toLowerCase();
        const dj = suggestions.find(dj => dj.name.toLowerCase() === checkCaseDjName);
        
        if (dj) {
            setError(`${dj.name} already exists`)
            setSuccess('')
            setName('')
        } else {
            setSuccess('Available')
            setError('')
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Clear previous messages
        setSubmitError('');
        setSubmitSuccess('');
    
        // Validate form fields
        if (!name.trim() || genres.length === 0 || venues.length === 0) {
            setSubmitError('Please fill out all required fields.');
            return;
        }
    
        for (const genre of genres) {
            if (!subgenres[genre] || subgenres[genre].length === 0) {
                setSubmitError(`Each genre must have at least one subgenre. Please add subgenres for the genre "${genre}".`);
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
            setSubmitSuccess('DJ added successfully!');
            handleClearForm();
        } catch (err) {
            // Set error message if DJ already exists
            setSubmitError(`Failed to add DJ, ${name} already exists in the DataBass.`);
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
        setProduces('');
        setGenreInput('');
        setGenres([]);
        setSubgenres({});
        setVenueInput('');
        setVenues([]);
        setError('');
        setSuccess('');
        setSubmitError('');
        setSubmitSuccess('');
    };

    const isFormValid = () => {
        return name.trim() !== '' &&
               produces !== '' &&
               genres.length > 0 &&
               venues.length > 0 &&
               genres.every(genre => subgenres[genre] && subgenres[genre].length > 0); // Ensure each genre has at least one subgenre
    };
    

    return (
        <div className="tabcontent">
            <h1 className="white">Add DJ Form</h1>
            <Container className="add-dj-container">
                <Form onSubmit={handleSubmit}>

                    {/* Add DJ name, check if blank, check if exists in database */}
                    <Form.Group controlId="djName">
                        <Form.Label>DJ Name:</Form.Label>
                        <InputGroup className>
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
                    
                    {/* Add music production status via dropdown */}
                    <Form.Group controlId="producesMusic">
                        <Form.Label>Music Production Status:</Form.Label>
                        <Form.Control
                            as="select"
                            value={produces}
                            onChange={(e) => setProduces(e.target.value)}
                            required // Make the field required
                        >
                            <option value="" disabled>Please select an option</option> {/* Placeholder option */}
                            <option value="No">Non-Producer</option>
                            <option value="Yes">Producer</option>
                        </Form.Control>
                        <Form.Group className="form-messages"> {/* Keep this in for space styling */}
                        </Form.Group>
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
                    
                    <Button
                    variant="primary"
                    type="submit"
                    disabled={!isFormValid()} // Disable button if form is not valid
                    >
                        Add DJ
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleClearForm}
                        className="ms-2"
                    >
                        Clear Form
                    </Button>
                    <Form.Group className="form-messages mt-3">
                        {submitError && (
                            <div className="text-error">{submitError}</div>
                        )}
                        {submitSuccess && (
                            <div className="text-success">{submitSuccess}</div>
                        )}
                    </Form.Group>
                </Form>

            </Container>
        </div>
    );
}
