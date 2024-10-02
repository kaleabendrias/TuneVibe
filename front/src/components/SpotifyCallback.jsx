import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from './AuthContext';

const SpotifyCallback = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const authError = urlParams.get('error');

    if (authError) {
      setError('Authorization failed: ' + authError);
      return;
    }

    if (code) {
      exchangeCodeForTokens(code);
    } else {
      setError('No authorization code found in the URL');
    }
  }, [location]);

  const exchangeCodeForTokens = async (code) => {
    try {
      const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
      const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
      const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

      // Debug logging
      console.log('Exchanging code for tokens...');
      console.log('Code:', code);
      console.log('Redirect URI:', REDIRECT_URI);

      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        }).toString()
      });

      const data = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(`${data.error}: ${data.error_description}`);
      }

      console.log('Token exchange successful');
      
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);

      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_refresh_token', data.refresh_token);

      console.log('Access token set, navigating to dashboard');
      navigate('/dashboard');
      window.location.reload();
    } catch (error) {
      console.error('Token exchange error:', error);
      setError(`Failed to exchange code for tokens: ${error.message}`);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      <p className="mt-4 text-lg">Completing login...</p>
    </div>
  );
};

export default SpotifyCallback;