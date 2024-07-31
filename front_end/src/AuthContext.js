import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);

    const setToken = (token) => {
        setAuthToken(token);
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    };

    return (
        <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
