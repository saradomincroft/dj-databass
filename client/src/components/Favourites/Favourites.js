import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Favourites.css';

export default function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const [filteredFavourites, setFilteredFavourites] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]);
    const [subgenres, setSubgenres] = useState([]);
    const [venues, setVenues] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedSubgenre, setSelectedSubgenre] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');
    const [selectedProduces, setSelectedProduces] = useState('');

    // Fetch functions
    const fetchFavourites = useCallback(async () => {
        try {
            const response = await axios.get('/api/me/favourites');
            setFavourites(response.data.favourites || []);
            setFilteredFavourites(response.data.favourites || []);
        } catch (error) {
            setError('Error fetching favourites');
            console.error('Error fetching favourites:', error);
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


    // Filter function
    const filterFavourites = useCallback(() => {
        let filtered = favourites;

        if (search.trim() !== '') {
            filtered = filtered.filter(dj =>
                dj.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedGenre) {
            filtered = filtered.filter(dj => dj.genres?.includes(selectedGenre));
        }

        if (selectedSubgenre && selectedGenre) {
            filtered = filtered.filter(dj =>
                dj.subgenres?.[selectedGenre]?.includes(selectedSubgenre)
            );
        }

        if (selectedVenue) {
            filtered = filtered.filter(dj => dj.venues?.includes(selectedVenue));
        }

        if (selectedProduces) {
            const isProducing = selectedProduces === 'Yes';
            filtered = filtered.filter(dj => dj.produces === isProducing);
        }

        setFilteredFavourites(filtered);
    }, [search, selectedGenre, selectedSubgenre, selectedVenue, selectedProduces, favourites]);

    useEffect(() => {
        fetchGenres();
        fetchVenues();
        fetchFavourites();
    }, [fetchGenres, fetchVenues, fetchFavourites]);

    useEffect(() => {
        fetchSubgenres();
    }, [selectedGenre, fetchSubgenres]);

    useEffect(() => {
        filterFavourites();
    }, [search, selectedGenre, selectedSubgenre, selectedVenue, selectedProduces, favourites, filterFavourites]);

    const handleSearch = (event) => setSearch(event.target.value);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
        setSelectedSubgenre('');
    };

    const handleSubgenreChange = (event) => setSelectedSubgenre(event.target.value);
    const handleVenueChange = (event) => setSelectedVenue(event.target.value);
    const handleProduceChange = (event) => setSelectedProduces(event.target.value);

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

    const handleClear = () => {
        setSearch('');
        setSelectedGenre('');
        setSelectedSubgenre('');
        setSelectedVenue('');
        setSelectedProduces('');
        setFilteredFavourites(favourites);
    };

    return (
        <div id="Djs" className="tabcontent">
            <div className="container-fluid">
                <div className="scrollable-container">
                    <div className="favourites">
                        <h2>Favourites</h2>
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
                        {filteredFavourites.length === 0 ? (
                            <p>No favourites found</p>
                        ) : (
                            <ul className="list-group">
                                {filteredFavourites.map(dj => (
                                    <li key={dj.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <Link to={`/dj/${dj.id}`}>{dj.name}</Link>
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
