// src/components/Auth/Signup.js
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import '../AuthStyles.css';
import GoogleAuthButton from '../GoogleAuthButton';
import axios from "axios";
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useEffect, useState } from 'react';

const SignupSchema = Yup.object().shape({
    firstname: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    lastname: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
        .min(8, 'Password is too short')
        .required('Required'),
});

const Signup = () => {
    const [recaptchaToken, setRecaptchaToken] = useState('');
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
        alert('reCAPTCHA expired. Please complete the reCAPTCHA again.');
    };
    const handleSignup = async (values, { setSubmitting, resetForm }) => {
        try {
            if (!recaptchaToken) {
                alert('Please complete the reCAPTCHA');
                setSubmitting(false);
                return;
            }
            await axios.post('http://localhost:3000/api/signup', {
                firstName: values.firstname,
                lastName: values.lastname,
                email: values.email,
                password: values.password,
                recaptchaToken: recaptchaToken
            });
            alert('Signup successful!');
            resetForm();
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Signup failed: ${error.response.data.message}`);
            } else {
                alert('Signup failed: An error occurred.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <div className="auth-container">
                        <h2 className="text-center mb-4">Sign Up</h2>
                        <Formik
                            initialValues={{ firstname: '', lastname: '', email: '', password: '' }}
                            validationSchema={SignupSchema}
                            onSubmit={handleSignup}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <BootstrapForm.Group controlId="formFirstname">
                                        <BootstrapForm.Label>Firstname</BootstrapForm.Label>
                                        <Field as={BootstrapForm.Control} type="text" name="firstname" isInvalid={!!ErrorMessage} />
                                        <ErrorMessage name="firstname" component="div" className="invalid-feedback" />
                                    </BootstrapForm.Group>

                                    <BootstrapForm.Group controlId="formLastname">
                                        <BootstrapForm.Label>Lastname</BootstrapForm.Label>
                                        <Field as={BootstrapForm.Control} type="text" name="lastname" isInvalid={!!ErrorMessage} />
                                        <ErrorMessage name="lastname" component="div" className="invalid-feedback" />
                                    </BootstrapForm.Group>

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
                                        Sign Up
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
                            <p>Already have an account? <Link to="/signin">Sign In</Link></p>
                            <p><Link to="/forgot-password">Forgot Password?</Link></p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
