import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SpotifyAuthComponent from "./components/Spotify";
import SpotifyCallback from "./components/SpotifyCallback";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpotifyAuthComponent />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
