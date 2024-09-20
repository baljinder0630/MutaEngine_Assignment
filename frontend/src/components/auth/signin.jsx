/* eslint-disable no-unused-vars */
// src/components/Auth/Signin.js
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
// import '../AuthStyles.css';
import GoogleAuthButton from '../GoogleAuthButton';
import axios from "axios";
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

const Signin = () => {
    const { login } = useAuth();
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(false);

    useEffect(() => {
        if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
                window.grecaptcha.render('recaptcha-container', {
                    sitekey: '6Lfv8kkqAAAAAG_21w3DEX96q86VTAIA-k6BdYKm',
                    callback: handleRecaptchaChange,
                    'expired-callback': handleRecaptchaExpire,
                });
            });
        }
    }, []);
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };
    const handleRecaptchaExpire = () => {
        setRecaptchaToken('');
        // alert('reCAPTCHA expired. Please complete the reCAPTCHA again.');
    };

    const handleSignin = async (values, { setSubmitting, resetForm }) => {
        try {
            if (!recaptchaToken) {
                alert('Please complete the reCAPTCHA');
                setSubmitting(false);
                return;
            }
            const response = await axios.post('http://localhost:3000/api/signin', {
                email: values.email,
                password: values.password,
                recaptchaToken: recaptchaToken
            });

            // Show success alert on success
            alert('Signin successful!');
            const data = response.data
            if (data.success) {
                setUser(true)
                login(data.accessToken);
                navigate('/', { state: { user: true } });
                resetForm();

            }
        } catch (error) {
            // Show error alert if there’s an issue
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Signin failed: ${error.response.data.message}`);
            } else {
                alert('Signin failed: An error occurred.');
            }
        } finally {
            setSubmitting(false);  // Stop the submitting state
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <div className="auth-container">
                        <h2 className="text-center mb-4">Sign In</h2>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={SigninSchema}
                            onSubmit={handleSignin}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <BootstrapForm.Group controlId="formEmail">
                                        <BootstrapForm.Label>Email</BootstrapForm.Label>
                                        <Field as={BootstrapForm.Control} type="email" name="email" isInvalid={!!ErrorMessage} />
                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                    </BootstrapForm.Group>

                                    <BootstrapForm.Group controlId="formPassword">
                                        <BootstrapForm.Label>Password</BootstrapForm.Label>
                                        <Field as={BootstrapForm.Control} type="password" name="password" isInvalid={!!ErrorMessage} />
                                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                    </BootstrapForm.Group>
                                    <div id="recaptcha-container"></div>

                                    <Button className='w-100 mt-3' type="submit" disabled={isSubmitting}>
                                        Sign In
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                        {/* Google Sign-In Button */}
                        <div className="my-4">
                            <GoogleAuthButton />
                        </div>

                        {/* Signin and Forgot Password links */}
                        <div className="text-center mt-4">
                            <p>Don`t have an account? <Link to="/signup">Sign Up</Link></p>
                            <p><Link to="/forgot-password">Forgot Password?</Link></p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Signin;
