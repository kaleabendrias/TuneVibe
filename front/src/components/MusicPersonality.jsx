import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const MusicPersonality = () => {
  const [personality, setPersonality] = useState(null);
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analyzePersonality();
  }, []);

  const analyzePersonality = async () => {
    setLoading(true);

    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      setPersonality({ description: "Spotify token missing." });
      setLoading(false);
      return;
    }

    try {
      /* -------------------------------
         1. Fetch profile
      -------------------------------- */
      const meRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = meRes.ok ? await meRes.json() : null;

      /* -------------------------------
         2. Fetch top tracks
      -------------------------------- */
      const tracksRes = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=30",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const tracksData = tracksRes.ok ? await tracksRes.json() : null;

      const tracks = tracksData?.items ?? [];

      /* -------------------------------
         3. Attempt audio features (optional)
      -------------------------------- */
      let audioSummary = null;

      try {
        const ids = tracks
          .filter((t) => t.id && !t.is_local)
          .slice(0, 20)
          .map((t) => t.id)
          .join(",");

        if (ids) {
          const featuresRes = await fetch(
            `https://api.spotify.com/v1/audio-features?ids=${ids}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (featuresRes.ok) {
            const featuresData = await featuresRes.json();
            const valid = featuresData.audio_features.filter(Boolean);

            if (valid.length) {
              audioSummary = valid.reduce(
                (acc, f) => {
                  acc.energy += f.energy;
                  acc.danceability += f.danceability;
                  acc.valence += f.valence;
                  return acc;
                },
                { energy: 0, danceability: 0, valence: 0 }
              );

              Object.keys(audioSummary).forEach(
                (k) => (audioSummary[k] /= valid.length)
              );
            }
          } else {
            setWarning("Audio analysis unavailable (Spotify restriction).");
          }
        }
      } catch {
        setWarning("Audio analysis unavailable.");
      }

      /* -------------------------------
         4. Fallback personality logic
      -------------------------------- */
      const personality = {
        displayName: me?.display_name,
        country: me?.country,
        followers: me?.followers?.total,
        product: me?.product,
        topTrackCount: tracks.length,
        energy: audioSummary?.energy,
        danceability: audioSummary?.danceability,
        mood: audioSummary
          ? audioSummary.valence > 0.6
            ? "Positive"
            : audioSummary.valence < 0.4
            ? "Moody"
            : "Balanced"
          : "Unknown",
      };

      setPersonality(personality);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Analyzing your music profile…</p>;

  if (!personality) return <p>No data available.</p>;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Your Music Profile</h2>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><strong>Name:</strong> {personality.displayName}</p>
        <p><strong>Country:</strong> {personality.country}</p>
        <p><strong>Account:</strong> {personality.product}</p>
        <p><strong>Followers:</strong> {personality.followers}</p>
        <p><strong>Top Tracks Loaded:</strong> {personality.topTrackCount}</p>

        {personality.energy && (
          <>
            <p><strong>Energy:</strong> {(personality.energy * 100).toFixed(0)}%</p>
            <p><strong>Danceability:</strong> {(personality.danceability * 100).toFixed(0)}%</p>
            <p><strong>Mood:</strong> {personality.mood}</p>
          </>
        )}

        {warning && (
          <p className="text-yellow-600 mt-2">{warning}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicPersonality;
