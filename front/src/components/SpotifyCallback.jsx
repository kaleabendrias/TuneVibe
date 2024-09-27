import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";

const SpotifyCallback = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setError('Authorization failed: ' + error);
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

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        })
      });

      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }

      const data = await response.json();

      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_refresh_token', data.refresh_token);

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to exchange code for tokens: ' + error.message);
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