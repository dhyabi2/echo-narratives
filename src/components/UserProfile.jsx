import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../hooks/useUser';

const UserProfile = () => {
  const { user } = useAuth();
  const { userData, isLoading, error } = useUser(user.uid);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={userData.avatarUrl} alt={userData.username} />
        <AvatarFallback>{userData.username[0]}</AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-bold">{userData.username}</h2>
      <p>{userData.bio}</p>
      <div className="flex space-x-4">
        <div>
          <strong>{userData.followers.length}</strong> Followers
        </div>
        <div>
          <strong>{userData.following.length}</strong> Following
        </div>
      </div>
      <Button>Edit Profile</Button>
    </div>
  );
};

export default UserProfile;