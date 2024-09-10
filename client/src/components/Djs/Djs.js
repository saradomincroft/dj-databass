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

    const fetchFavourites = useCallback(async () => {
        try {
            const response = await axios.get('/api/me/favourites');
            setFavourites(response.data.favourites || []);
        } catch (error) {
            setError('Error fetching favourites');
            console.error('Error fetching favourites:', error);
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
            const isProducing = selectedProduces === 'Yes';
            filtered = filtered.filter(dj => dj.produces === isProducing);
        }

        setFilteredDjs(filtered);
    }, [search, selectedGenre, selectedSubgenre, selectedVenue, selectedProduces, allDjs]);

    useEffect(() => {
        fetchAllDjs();
        fetchGenres();
        fetchVenues();
        fetchFavourites();
    }, [fetchAllDjs, fetchGenres, fetchVenues, fetchFavourites]);

    useEffect(() => {
        fetchSubgenres();
    }, [selectedGenre, fetchSubgenres]);

    useEffect(() => {
        filterDjs();
    }, [search, selectedGenre, selectedSubgenre, selectedVenue, selectedProduces, allDjs, filterDjs]);

    const handleSearch = (event) => setSearch(event.target.value);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
        setSelectedSubgenre('');
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
        setFilteredDjs(allDjs);
    };

    const handleToggleFavourite = async (dj) => {
        try {
            const isFavourite = favourites.some(fav => fav.id === dj.id);
            if (isFavourite) {
                await axios.delete('/api/me/favourites', { data: { dj_id: dj.id } });
                setFavourites(prevFavourites => prevFavourites.filter(fav => fav.id !== dj.id));
            } else {
                await axios.post('/api/me/favourites', { dj_id: dj.id });
                setFavourites(prevFavourites => [...prevFavourites, dj]);
            }
        } catch (error) {
            setError('Error updating favourites');
            console.error('Error updating favourites:', error);
        }
    };

    const isFavourite = (dj) => favourites.some(fav => fav.id === dj.id);

    return (
        <div id="Djs">
            <div className="container-fluid">
                <div className="scrollable-container">
                    <div className="filter-controls form-controls-container">
                        {/* FILTER NAME & PRODUCTION STATUS */}
                        <div className="row">
                            <div className="col-6 d-flex align-items-center">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Search DJs by name"
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="col-6 d-flex align-items-center">
                                <select
                                    id="produces"
                                    className="form-select"
                                    value={selectedProduces}
                                    onChange={handleProduceChange}
                                >
                                <option value="">Producer?</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* GENRES & SUBGENRES DROPDOWNS */}
                        <div className="mb-3 row">
                        <div className="col-6">
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
                        <div className="col-6">
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
                    </div>
                    {/* VENUE DROPDOWNS */}
                    <div className="row">
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
                        </div>
                        <button className="btn btn-secondary" onClick={handleClear}>
                            Clear Filters
                        </button>
                    </div>

                    <div className="dj-list">
                        <h1 className="dj-list-title">All DJs</h1>
                        {error && <p className="text-danger">{error}</p>}
                        {filteredDjs.length === 0 ? (
                            <p>No DJs found</p>
                        ) : (
                            <ul className="list-group">
                                {filteredDjs.map(dj => (
                                    <li key={dj.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <Link to={`/dj/${dj.id}`}>{dj.name}</Link>
                                            {dj.genres && dj.genres.length > 0 && (
                                                <span className="dj-genres">
                                                    {' | ' + dj.genres.join(' | ')}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className="btn heart-container"
                                            onClick={() => handleToggleFavourite(dj)}
                                        >
                                            <span className={`favourite-icon ${isFavourite(dj) ? 'filled' : ''}`}>
                                                {isFavourite(dj) ? '❤️' : '♡'}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}
