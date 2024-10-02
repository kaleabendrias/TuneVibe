import PropTypes from 'prop-types';
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotify_access_token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('spotify_refresh_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, [accessToken]);

  const value = {
    accessToken,
    refreshToken,
    isAuthenticated,
    setAccessToken,
    setRefreshToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;