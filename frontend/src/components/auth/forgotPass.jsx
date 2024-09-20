import { useEffect, useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!recaptchaToken) {
                alert('Please complete the reCAPTCHA');
                return;
            }
            const response = await axios.post(`http://localhost:3000/api/forgotpassword`, { email, recaptchaToken });
            setMessage(response.data.message);

        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to send reset link. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ textAlign: 'center' }}>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div id="recaptcha-container"></div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Send Reset Link
                </button>
                {message && <p style={{ marginTop: '15px', textAlign: 'center', color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;
