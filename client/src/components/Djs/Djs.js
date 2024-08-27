import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Djs.css';

export default function Djs() {
    const [allDjs, setAllDjs] = useState([]);
    const [filteredDjs, setFilteredDjs] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]);
    const [subgenres, setSubgenres] = useState([]);
    const [venues, setVenues] = useState([]);
    const [produces, setProduces] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedSubgenre, setSelectedSubgenre] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');
    const [selectedProduces, setSelectedProduces] = useState('');
    const [favourites, setFavourites] = useState([]);

    // Fetch functions
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
        if (selectedGenre) {
            try {
                const response = await axios.get(`/api/genres/${encodeURIComponent(selectedGenre)}/subgenres`);
                setSubgenres(response.data);
            } catch (error) {
                setError('Error fetching subgenres');
                console.error('Error fetching subgenres:', error);
            }
        } else {
            setSubgenres([]);
        }
    }, [selectedGenre]);

    const fetchVenues = useCallback(async () => {
        try {
            const response = await axios.get('/api/venues');
            setVenues(response.data);
        } catch (error) {
            setError('Error fetching venues');
            console.error('Error fetching venues:', error);
        }
    }, []);

    const fetchProduces = useCallback(async () => {
        try {
            const response = await axios.get('/api/produces');
            setProduces(response.data);
        } catch (error) {
            setError('Error fetching produces');
            console.error('Error fetching produces:', error);
        }
    }, []);

    const filterDjs = useCallback(() => {
        let filtered = allDjs;

        if (search.trim() !== '') {
            filtered = filtered.filter(dj =>
                dj.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedGenre) {
            filtered = filtered.filter(dj => dj.genres?.includes(selectedGenre));
        }

        if (selectedSubgenre && selectedGenre) {
            filtered = filtered.filter(dj => dj.subgenres?.[selectedGenre]?.includes(selectedSubgenre));
        }

        if (selectedVenue) {
            filtered = filtered.filter(dj => dj.venues?.includes(selectedVenue));
        }

        if (selectedProduces) {
            // Handle filtering based on the produce status
            const isProducing = selectedProduces === "Yes";
            filtered = filtered.filter(dj => dj.produces === isProducing);
        }

        setFilteredDjs(filtered);
    }, [search, selectedGenre, selectedSubgenre, selectedVenue, selectedProduces, allDjs]);

    useEffect(() => {
        fetchAllDjs();
        fetchGenres();
        fetchVenues();
        fetchProduces();
    }, [fetchAllDjs, fetchGenres, fetchVenues, fetchProduces]);

    useEffect(() => {
        fetchSubgenres();
    }, [selectedGenre, fetchSubgenres]);

    useEffect(() => {
        filterDjs();
    }, [search, selectedGenre, selectedSubgenre, selectedVenue, selectedProduces, allDjs, filterDjs]);

    const handleSearch = (event) => setSearch(event.target.value);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
        setSelectedSubgenre(''); // Reset subgenre when genre changes
    };

    const handleSubgenreChange = (event) => setSelectedSubgenre(event.target.value);

    const handleVenueChange = (event) => setSelectedVenue(event.target.value);

    const handleProduceChange = (event) => setSelectedProduces(event.target.value);

    const handleClear = () => {
        setSearch('');
        setSelectedGenre('');
        setSelectedSubgenre('');
        setSelectedVenue('');
        setSelectedProduces('');
        setSubgenres([]);
        setFilteredDjs(allDjs);
    };

    const handleToggleFavourite = (dj) => {
        setFavourites(prevFavourites => {
            const isFavourite = prevFavourites.find(fav => fav.id === dj.id);
            if (isFavourite) {
                return prevFavourites.filter(fav => fav.id !== dj.id);
            }
            return [...prevFavourites, dj];
        });
    };

    const isFavourite = (dj) => favourites.some(fav => fav.id === dj.id);

    return (
        <div id="Home" className="tabcontent">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className="scrollable-container">
                            <div className="favourites">
                                <h2>Favourites</h2>
                                {favourites.length === 0 && <p>No favourites yet</p>}
                                <ul className="list-group">
                                    {favourites.map(dj => (
                                        <li key={dj.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <Link to={`/dj/${dj.id}`}>{dj.name}</Link>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => handleToggleFavourite(dj)}
                                            >
                                                {isFavourite(dj) ? '❤️' : '♡'}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="scrollable-container">
                            <div className="filter-controls form-controls-container">
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Search DJs by name"
                                    value={search}
                                    onChange={handleSearch}
                                />
                                <select
                                    id="produces"
                                    className="form-select mb-3"
                                    value={selectedProduces}
                                    onChange={handleProduceChange}
                                >
                                    <option value="">Select Produces Status</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>

                                <div className="mb-3">
                                    <select
                                        id="genre"
                                        className="form-select"
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
                                <div className="mb-3">
                                    <select
                                        id="subgenre"
                                        className="form-select"
                                        value={selectedSubgenre}
                                        onChange={handleSubgenreChange}
                                        disabled={!selectedGenre}
                                    >
                                        <option value="">Select Subgenre</option>
                                        {subgenres.map(subgenre => (
                                            <option key={subgenre.id} value={subgenre.subtitle}>
                                                {subgenre.subtitle}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <select
                                        id="venue"
                                        className="form-select"
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
                                <button className="btn btn-secondary" onClick={handleClear}>
                                    Clear Filters
                                </button>
                            </div>

                            <div className="dj-list">
                                <h2>DJ List</h2>
                                {error && <p className="text-danger">{error}</p>}
                                {filteredDjs.length === 0 ? (
                                    <p>No DJs found</p>
                                ) : (
                                    <ul className="list-group">
                                        {filteredDjs.map(dj => (
                                            <li key={dj.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <Link to={`/dj/${dj.id}`}>{dj.name}</Link>
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => handleToggleFavourite(dj)}
                                                >
                                                    {isFavourite(dj) ? '❤️' : '♡'}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
