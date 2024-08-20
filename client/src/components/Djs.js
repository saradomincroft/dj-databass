import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Djs() {
    const [allDjs, setAllDjs] = useState([]);
    const [filteredDjs, setFilteredDjs] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllDjs();
    }, []);

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

    // Search DJs based on the search input
    const handleSearch = () => {
        if (search.trim() === '') {
            setFilteredDjs(allDjs); // Show all DJs if search is empty
        } else {
            const filtered = allDjs.filter(dj =>
                dj.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredDjs(filtered);
        }
    };

    return (
        <div>
            <h1>DJs</h1>
            <input
                type="text"
                placeholder="Search DJs by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
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
};
