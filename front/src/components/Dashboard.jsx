import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import MusicHeatmap from './MusicHeatMap';
import MusicQuiz from './MusicQuiz';
import MoodAnalyzer from './MoodAnalyser';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('heatmap');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const renderActiveComponent = () => {
    switch(activeComponent) {
      case 'heatmap':
        return <MusicHeatmap />;
      case 'quiz':
        return <MusicQuiz />;
      case 'mood':
        return <MoodAnalyzer />;
      default:
        return <MusicHeatmap />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userProfile?.display_name}!</h1>
      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setActiveComponent('heatmap')}>Music Heatmap</Button>
        <Button onClick={() => setActiveComponent('quiz')}>Music Quiz</Button>
        <Button onClick={() => setActiveComponent('mood')}>Mood Analyzer</Button>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            {activeComponent === 'heatmap' && 'Your Music Timeline'}
            {activeComponent === 'quiz' && 'Music Quiz Game'}
            {activeComponent === 'mood' && 'Mood Analyzer'}
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