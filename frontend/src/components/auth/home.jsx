/* eslint-disable no-unused-vars */
// src/components/home/HomePage.js
import { Link } from 'react-router-dom';
import '../HomePageStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from './AuthContext'; // Assuming AuthContext is implemented
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import { useLocation } from 'react-router-dom';

const HomePage = () => {
    const location = useLocation();
    const user = location.state?.user;
    const accessToken = Cookies.get('accessToken');
    const { isLoggedIn, logout } = useAuth();


    return (
        <>

            <Container className="home-container text-center">
                <h1 className="mb-4">Welcome! This assignment was done by Baljinder Singh</h1>
                <p>
                    <a href="https://github.com/baljinder0630" target="_blank" rel="noreferrer">GitHub Profile</a> |
                    <a href="https://www.linkedin.com/in/baljinder-singh-269794229/" target="_blank" rel="noreferrer">LinkedIn Profile</a>
                </p>

                <p className="mb-4">Sign up or Sign in to continue.</p>
                <div className="home-buttons">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/signup">
                                <Button variant="primary" className="home-button">Sign Up</Button>
                            </Link>
                            <Link to="/signin">
                                <Button variant="secondary" className="home-button">Sign In</Button>
                            </Link>
                        </>
                    ) : (<>
                        <Link to="/purchase">

                            <Button variant="success" className="home-button">Our Services</Button>
                        </Link>
                        <Button variant="secondary" className="home-button" onClick={logout}>Logout</Button>
                    </>

                    )}
                </div>
            </Container>


        </>
    );
};

export default HomePage;
