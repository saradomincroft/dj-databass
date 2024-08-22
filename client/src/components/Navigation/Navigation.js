import React, {useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {Navbar, Nav, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css'

export default function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(sessionStorage.getItem('activeTab') || 'home' );
    const [burgerVisible, setBurgerVisible] = useState(true);
    const navigate = useNavigate();

    useEffect( () => {
        sessionStorage.setItem('activeTab', activeTab);
    }, [activeTab])

    const openNav = () => {
        document.getElementById('mySidebar').style.width = '100%';
        setBurgerVisible(false);
    };

    const closeNav = () => {
        document.getElementById('mySidebar').style.width = '0';
        setTimeout(() => {
            setBurgerVisible(true);
        }, 400);
        setMenuOpen(false);
    };

    const openTab = (tabName, path) => {
        setActiveTab(tabName);
        closeNav();
        navigate(path);
    };

    return (
        <div className={`overlay-menu ${menuOpen ? 'open' : '' }`}>
            <Navbar expand='lg' className='custom-navbar'>
                <Container>
                    <Navbar.Collapse id='responsive-navbar-nav' className={`justify-content-center ${menuOpen ? 'show' : ''}`}>
                        <Nav className='align-items-center custom-nav'>
                            <Nav.Link as={NavLink} to='/' exact onClick={() => openTab('home', '/')}>Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/add-dj" onClick={() => openTab('add-dj', '/add-dj')}>Add DJ</Nav.Link>
                            <Nav.Link as={NavLink} to="/djs" onClick={() => openTab('djs', '/djs')}>DJs</Nav.Link>
                            <Nav.Link as={NavLink} to="/me" className="nav-link" onClick={() => openTab('me', '/me')}>Account</Nav.Link>
                       </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {burgerVisible && <button id="openbtn" className="open-menu" onClick={openNav}>☰</button>}
            <div id="mySidebar" className="sidebar">
                <button className="closebtn" onClick={closeNav}>×</button>
                <Nav className="flex-column align-items-center custom-nav">
                    <Nav.Link as={NavLink} to="/" exact className="nav-link" onClick={() => openTab('home', '/')}>Home</Nav.Link>
                    <Nav.Link as={NavLink} to="/add-dj" className="nav-link" onClick={() => openTab('add-dj', '/add-dj')}>Add DJ</Nav.Link>
                    <Nav.Link as={NavLink} to="/djs" className="nav-link" onClick={() => openTab('djs', '/djs')}>DJs</Nav.Link>
                    <Nav.Link as={NavLink} to="/me" className="nav-link" onClick={() => openTab('me', '/me')}>Account</Nav.Link>
                </Nav>
            </div>
        </div>
  
    );
};
