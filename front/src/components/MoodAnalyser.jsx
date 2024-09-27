import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MoodAnalyzer = () => {
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeMood = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('spotify_access_token');
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      const trackIds = data.items.map(item => item.track.id).join(',');
      
      const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const featuresData = await featuresResponse.json();
      
      const moodScore = calculateMoodScore(featuresData.audio_features);
      setMood(interpretMoodScore(moodScore));
    } catch (error) {
      console.error('Error analyzing mood:', error);
      setMood('Unable to analyze mood');
    }
    setLoading(false);
  };

  const calculateMoodScore = (features) => {
    const relevantFeatures = features.map(feature => ({
      valence: feature.valence,
      energy: feature.energy,
      danceability: feature.danceability
    }));

    const averageFeatures = relevantFeatures.reduce((acc, feature) => {
      acc.valence += feature.valence;
      acc.energy += feature.energy;
      acc.danceability += feature.danceability;
      return acc;
    }, { valence: 0, energy: 0, danceability: 0 });

    const count = relevantFeatures.length;
    averageFeatures.valence /= count;
    averageFeatures.energy /= count;
    averageFeatures.danceability /= count;

    return (averageFeatures.valence * 0.5 + averageFeatures.energy * 0.3 + averageFeatures.danceability * 0.2);
  };

  const interpretMoodScore = (score) => {
    if (score > 0.8) return "Ecstatic";
    if (score > 0.6) return "Happy";
    if (score > 0.4) return "Content";
    if (score > 0.2) return "Melancholic";
    return "Somber";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Mood Analyzer</h2>
        {mood ? (
          <p className="mb-4">Based on your recent listening, your mood seems to be: <strong>{mood}</strong></p>
        ) : (
          <p className="mb-4">Click the button to analyze your mood based on recent listening history.</p>
        )}
        <Button onClick={analyzeMood} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Mood'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodAnalyzer;