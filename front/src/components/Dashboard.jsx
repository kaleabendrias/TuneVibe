import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import MusicHeatmap from './MusicHeatMap';
import MusicQuiz from './MusicQuiz';
import MusicPersonality from './MusicPersonality';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('heatmap');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await res.json();
    setUserProfile(data);
  };


  const renderActiveComponent = () => {
    switch(activeComponent) {
      case 'heatmap':
        return <MusicHeatmap />;
      case 'quiz':
        return <MusicQuiz />;
      case 'Music Personality':
        return <MusicPersonality />;
      default:
        return <MusicHeatmap />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {userProfile?.display_name}
      </h1>

      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setActiveComponent('heatmap')}>Music Heatmap</Button>
        <Button onClick={() => setActiveComponent('quiz')}>Music Quiz</Button>
        <Button onClick={() => setActiveComponent('Music Personality')}>Music Personality</Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            {activeComponent === 'heatmap' && 'Your Music Timeline'}
            {activeComponent === 'quiz' && 'Music Quiz Game'}
            {activeComponent === 'Music Personality' && 'Music Personality Analysis'}
          </h2>
        </CardHeader>
        <CardContent>
          {renderActiveComponent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;