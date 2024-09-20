/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('accessToken'));

    const login = (token) => {
        Cookies.set('accessToken', token); // Set token in cookies
        setIsLoggedIn(true);
    };

    const logout = () => {
        Cookies.remove('accessToken'); // Remove token on logout
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);