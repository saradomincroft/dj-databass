import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Djs() {
    const [allDjs, setAllDjs] = useState([]);
    const [filteredDjs, setFilteredDjs] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);

    const [genres, setGenres] = useState([]);
    const [subgenres, setSubgenres] = useState([]);
    const [venues, setVenues] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedSubgenre, setSelectedSubgenre] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');

    // Define fetch functions
    const fetchAllDjs = useCallback(async () => {
        try {
            const response = await axios.get('/api/djs');
            setAllDjs(response.data);
            setFilteredDjs(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching DJs');
            console.error('Error fetching DJs:', error);
        }
    }, []);

    const fetchGenres = useCallback(async () => {
        try {
            const response = await axios.get('/api/genres');
            setGenres(response.data);
        } catch (error) {
            setError('Error fetching genres');
            console.error('Error fetching genres:', error);
        }
    }, []);

    const fetchSubgenres = useCallback(async () => {
        try {
            const response = await axios.get(`/api/genres/${encodeURIComponent(selectedGenre)}/subgenres`);
            setSubgenres(response.data);
        } catch (error) {
            setError('Error fetching subgenres');
            console.error('Error fetching subgenres:', error);
        }
    }, [selectedGenre]);

    const fetchVenues = useCallback(async () => {
        try {
            const response = await axios.get('/api/venues');
            console.log('Fetched venues:', response.data);
            setVenues(response.data);
        } catch (error) {
            setError('Error fetching venues');
            console.error('Error fetching venues:', error);
        }
    }, []);

    useEffect(() => {
        fetchAllDjs();
        fetchGenres();
        fetchVenues();
    }, [fetchAllDjs, fetchGenres, fetchVenues]);

    useEffect(() => {
        if (selectedGenre) {
            fetchSubgenres();
        } else {
            setSubgenres([]);
        }
    }, [selectedGenre, fetchSubgenres]);

    useEffect(() => {
        filterDjs();
    }, [search, selectedGenre, selectedSubgenre, selectedVenue, allDjs]);

    const filterDjs = () => {
        let filtered = allDjs;

        if (search.trim() !== '') {
            filtered = filtered.filter(dj =>
                dj.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedGenre) {
            filtered = filtered.filter(dj => {
                const genres = dj.genres || [];
                return genres.includes(selectedGenre);
            });
        }

        if (selectedSubgenre && selectedGenre) {
            filtered = filtered.filter(dj => {
                const subgenres = dj.subgenres && dj.subgenres[selectedGenre] || [];
                return subgenres.includes(selectedSubgenre);
            });
        }

        if (selectedVenue) {
            filtered = filtered.filter(dj => {
                const venues = dj.venues || [];
                return venues.includes(selectedVenue);
            });
        }

        setFilteredDjs(filtered);
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
        setSelectedSubgenre('');
    };

    const handleSubgenreChange = (event) => {
        setSelectedSubgenre(event.target.value);
    };

    const handleVenueChange = (event) => {
        setSelectedVenue(event.target.value);
    };

    const handleClear = () => {
        setSearch('');
        setSelectedGenre('');
        setSelectedSubgenre('');
        setSelectedVenue('');
        setSubgenres([]);
        setFilteredDjs(allDjs);
    };

    return (
        <div>
            <h1>DJs</h1>
            <input
                type="text"
                placeholder="Search DJs by name"
                value={search}
                onChange={handleSearch}
            />

            <div>
                <label htmlFor="genre">Genre:</label>
                <select
                    id="genre"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.title}>
                            {genre.title}
                        </option>
                    ))}
                </select>
            </div>

            {selectedGenre && (
                <div>
                    <label htmlFor="subgenre">Subgenre:</label>
                    <select
                        id="subgenre"
                        value={selectedSubgenre}
                        onChange={handleSubgenreChange}
                    >
                        <option value="">Select Subgenre</option>
                        {subgenres.map(subgenre => (
                            <option key={subgenre.id} value={subgenre.subtitle}>
                                {subgenre.subtitle}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="venue">Venue:</label>
                <select
                    id="venue"
                    value={selectedVenue}
                    onChange={handleVenueChange}
                >
                    <option value="">Select Venue</option>
                    {venues.map(venue => (
                        <option key={venue.id} value={venue.venuename}>
                            {venue.venuename}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleClear}>Clear Filters</button>

            {error && <p>{error}</p>}
            {filteredDjs.length === 0 && !error && <p>No DJs found</p>}
            <ul>
                {filteredDjs.map(dj => (
                    <li key={dj.id}>
                        <Link to={`/dj/${dj.id}`}>{dj.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
