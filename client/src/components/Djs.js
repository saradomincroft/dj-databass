import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Djs() {
    const [allDjs, setAllDjs] = useState([]);
    const [filteredDjs, setFilteredDjs] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);

    const [genres, setGenres] = useState([]);
    const [subgenres, setSubgenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedSubgenre, setSelectedSubgenre] = useState('');

    useEffect(() => {
        fetchAllDjs();
        fetchGenres();
    }, []);

    useEffect(() => {
        filterDjs(); // Filter DJs when search, genre, or subgenre changes
    }, [search, selectedGenre, selectedSubgenre]);

    useEffect(() => {
        if (selectedGenre) {
            fetchSubgenres(selectedGenre);
        } else {
            setSubgenres([]); // Clear subgenres if no genre is selected
        }
    }, [selectedGenre]);

    // Fetch all DJs
    const fetchAllDjs = async () => {
        try {
            const response = await axios.get('/api/djs');
            setAllDjs(response.data);
            setFilteredDjs(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching DJs');
            console.error('Error fetching DJs:', error);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await axios.get('/api/genres');
            setGenres(response.data);
        } catch (error) {
            setError('Error fetching genres');
            console.error('Error fetching genres', error);
        }
    };

    const fetchSubgenres = async (genre) => {
        if (!genre) {
            setSubgenres([]); // Clear subgenres if no genre is selected
            return;
        }
        try {
            console.log(`Fetching subgenres for genre: ${genre}`); // Debugging log
            const response = await axios.get(`/api/genres/${encodeURIComponent(genre)}/subgenres`);
            console.log('Subgenres response:', response.data); // Debugging log
            setSubgenres(response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(`Error fetching subgenres for genre ${genre}`);
            console.error('Error fetching subgenres:', error);
        }
    };
    

    const filterDjs = () => {
        let filtered = allDjs;
    
        if (search.trim() !== '') {
            filtered = filtered.filter(dj =>
                dj.name.toLowerCase().includes(search.toLowerCase())
            );
        }
    
        if (selectedGenre) {
            filtered = filtered.filter(dj =>
                dj.genres && dj.genres.includes(selectedGenre)
            );
        }
    
        if (selectedSubgenre) {
            filtered = filtered.filter(dj =>
                dj.subgenres && Object.values(dj.subgenres).flat().includes(selectedSubgenre)
            );
        }
    
        setFilteredDjs(filtered);
    };

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
    };

    const handleChange = (e) => {
        handleSearch(e.target.value);
    };

    const handleGenreChange = (event) => {
        const selectedGenre = event.target.value;
        setSelectedGenre(selectedGenre);  // Set the selected genre
        setSubgenres([]);  // Clear the subgenres
        // Fetch new subgenres based on the selected genre
        fetchSubgenres(selectedGenre);
};

    return (
        <div>
            <h1>DJs</h1>
            <input
                type="text"
                placeholder="Search DJs by name"
                value={search}
                onChange={handleChange}
            />

            <div>
                <label htmlFor="genre">Genre:</label>
                <select
                    id="genre"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.title}>
                            {genre.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="subgenre">Subgenre:</label>
                <select
                    id="subgenre"
                    value={selectedSubgenre}
                    onChange={(e) => setSelectedSubgenre(e.target.value)}
                    disabled={!selectedGenre} // Disable if no genre is selected
                >
                    <option value="">Select Subgenre</option>
                    {subgenres.map(subgenre => (
                        <option key={subgenre.id} value={subgenre.subtitle}>
                            {subgenre.subtitle}
                        </option>
                    ))}
                </select>
            </div>

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
