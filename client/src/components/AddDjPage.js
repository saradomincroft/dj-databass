import React, { useState } from 'react';
import axios from 'axios';

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!name.trim() || genres.length === 0 || venues.length === 0) {
            setError('Please fill out all required fields (DJ Name, at least one Genre, and at least one Venue).');
            return;
        }

        // Validate that each genre has at least one subgenre
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
            setError('');
        } catch (err) {
            setError('Failed to add DJ.');
            setSuccess('');
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

    return (
        <div>
            <h1>Add DJ</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>DJ Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Produces Music?</label>
                    <input
                        type="checkbox"
                        checked={produces}
                        onChange={(e) => setProduces(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Genres:</label>
                    <input
                        type="text"
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        placeholder="Enter genre"
                    />
                    <button type="button" onClick={handleAddGenre}>Add Genre</button>
                    {genres.map((genre, index) => (
                        <div key={index}>
                            <h3>{genre}</h3>
                            <button type="button" onClick={() => handleGenreRemove(genre)}>Remove Genre</button>
                            <button type="button" onClick={() => handleAddSubgenre(genre)}>Add Subgenre</button>
                            {subgenres[genre] && subgenres[genre].map((subgenre, subIndex) => (
                                <div key={subIndex}>
                                    <input
                                        type="text"
                                        value={subgenre}
                                        onChange={(e) => handleSubgenreChange(genre, subIndex, e.target.value)}
                                        placeholder="Enter subgenre"
                                    />
                                    <button type="button" onClick={() => handleRemoveSubgenre(genre, subIndex)}>Remove Subgenre</button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div>
                    <label>Venues:</label>
                    <input
                        type="text"
                        value={venueInput}
                        onChange={(e) => setVenueInput(e.target.value)}
                        placeholder="Enter venue"
                    />
                    <button type="button" onClick={handleAddVenue}>Add Venue</button>
                    {venues.map((venue, index) => (
                        <div key={index}>
                            <span>{venue}</span>
                            <button type="button" onClick={() => handleVenueRemove(venue)}>Remove Venue</button>
                        </div>
                    ))}
                </div>
                <button type="submit">Add DJ</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
}
