import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Settings } from 'lucide-react';
import { Button } from './ui/button';

const API_BASE_URL = 'https://ekos-api.replit.app';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [echoes, setEchoes] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [profileResponse, echoesResponse, badgesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/echoes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/badges`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProfile(profileResponse.data);
        setEchoes(echoesResponse.data.echoes);
        setBadges(badgesResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchData();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center mb-6">
        <User className="h-16 w-16 text-gray-400 mr-4" />
        <div>
          <h3 className="text-xl font-semibold">{profile.username}</h3>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Echoes</h3>
        {echoes.map((echo) => (
          <div key={echo.id} className="bg-white rounded-lg shadow p-4 mb-2">
            <h4 className="font-medium">{echo.title}</h4>
            <p className="text-sm text-gray-500">Likes: {echo.likes} | Replies: {echo.replies}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Badges</h3>
        <div className="grid grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-2xl mb-2">{badge.icon}</span>
              <span className="text-sm text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
