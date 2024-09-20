import './AuthStyles.css';

const GoogleAuthButton = () => {

    const handleGoogleSignIn = () => {
        // Redirect to your server's Google OAuth endpoint
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    return (
        <button className="google-button" onClick={handleGoogleSignIn}>
            Sign in with Google
        </button>
    );
};

export default GoogleAuthButton;
