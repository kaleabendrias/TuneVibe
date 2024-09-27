import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

const SpotifyAuthComponent = () => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'code';
  const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-library-read',
    'playlist-read-private'
  ];

  const handleLogin = () => {
    console.log(REDIRECT_URI, CLIENT_ID)
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join('%20')}`;
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <h2 className="text-2xl font-bold">Login with Spotify</h2>
      </CardHeader>
      <CardContent>
        <p>Connect your Spotify account to analyze your music preferences.</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          Connect Spotify
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpotifyAuthComponent;