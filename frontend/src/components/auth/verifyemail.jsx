import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Update to useNavigate for React Router v6
import { useAuth } from './AuthContext'; // Import your Auth context

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Replace useHistory with useNavigate
    const { login } = useAuth();
    const [loading, setLoading] = useState(true); // Add loading state to prevent multiple calls

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        // Only run verification if not already loading (i.e., if the effect hasn't been triggered before)
        if (!loading) return;

        const verifyEmail = async () => {
            setLoading(false); // Mark loading as false when finished

            if (!token) {
                setMessage('Invalid token. Please check your email for the correct link.');
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:3000/api/verifyemail?token=${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (data.success) {
                    login(); // Log the user in via context
                    setMessage('Email verified successfully! Redirecting to home...');
                    setTimeout(() => {
                        navigate('/home'); // Redirect to home or another page
                    }, 2000);
                } else {
                    setMessage(data.message || 'Verification failed. Please try again.');
                }
            } catch (error) {
                console.error('Error verifying email:', error);
                setMessage('An error occurred. Please try again later.');
            }
        };

        verifyEmail();
    }, []);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Verify Your Email</h2>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;
