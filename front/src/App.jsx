import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SpotifyAuthComponent from "./components/Spotify";
import SpotifyCallback from "./components/SpotifyCallback";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";
import SignOut from "./components/SignOut";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SignOut />
        <Routes>
          <Route path="/" element={<SpotifyAuthComponent />} />
          <Route path="/callback" element={<SpotifyCallback />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
