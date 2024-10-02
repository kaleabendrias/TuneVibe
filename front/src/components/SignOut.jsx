import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

const SignOut = () => {
  const { setAccessToken, setRefreshToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");

      navigate("/");
      window.location.reload();
    } catch (error) {
      setError("Failed to sign out: " + error.message);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-items-end items-center ">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="absolute right-0 flex items-center justify-end p-4">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`mt-4 px-4 py-2 rounded bg-red-500 text-white ${
              isSigningOut ? "opacity-50" : "hover:bg-red-600"
            }`}
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      ) : null}
    </>
  );
};

export default SignOut;
