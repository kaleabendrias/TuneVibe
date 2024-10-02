import { useState, useEffect } from 'react';
import { ScatterChart, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Scatter, ResponsiveContainer } from 'recharts';

const MusicHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListeningHistory();
  }, []);

  const fetchListeningHistory = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    const limit = 50;

    let allItems = [];
    let nextUrl = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(data)
        if (data?.items?.length) {
          allItems = allItems.concat(data.items);
          console.log(data.next)
          nextUrl = data.next;
        } else {
          nextUrl = null;
        }
      }

      if (allItems.length) {
        processDataForHeatmap(allItems);
      } else {
        setError('No listening history data found');
      }
      console.log(allItems)

    } catch (error) {
      console.error('Error fetching listening history:', error);
      console.log(error)
      setError('Error fetching listening history. Please try again later.');
    }
  };

  const processDataForHeatmap = (items) => {
    const processedData = [];

    items.forEach(item => {
      const date = new Date(item.played_at);
      const day = date.getDay();
      const hour = date.getHours();

      let existingEntry = processedData.find(d => d.day === day && d.hour === hour);

      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        processedData.push({ day, hour, count: 1 });
      }
    });

    setHeatmapData(processedData);
  };

  if (error) return <div>Error: {error}</div>;
  if (!heatmapData.length) return <div>Loading...</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="hour" name="Hour" domain={[0, 23]} />
        <YAxis type="number" dataKey="day" name="Day" domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} 
               tickFormatter={day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]} />
        <ZAxis type="number" dataKey="count" range={[0, 400]} name="Play Count" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={heatmapData} fill="rgba(34, 139, 34, 0.6)" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default MusicHeatmap;
