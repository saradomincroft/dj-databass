import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/add-dj">Add DJ</Link>
                </li>
                <li>
                    <Link to="/djs">DJs</Link>
                </li>

            </ul>
        </nav>
    );
};

export default Navbar;
