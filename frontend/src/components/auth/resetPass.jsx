// src/components/Auth/ResetPassword.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation(); // Get the current location object

    useEffect(() => {
        // Extract query parameters from the URL
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        const id = query.get('id');
        // You might want to handle these values, for example by storing them or sending them in requests

        if (!token || !id) {
            setMessage('Invalid or missing token.');
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        const id = query.get('id');
        try {
            const response = await axios.post(`http://localhost:3000/api/resetpassword/?token=${token}&id=${id}`, { password });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to reset password. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ textAlign: 'center' }}>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Reset Password
                </button>
                {message && <p style={{ marginTop: '15px', textAlign: 'center', color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
