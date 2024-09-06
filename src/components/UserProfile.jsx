import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import EchoStats from './EchoStats';

const UserProfile = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500">@{user.username}</p>
        </div>
      </div>
      <p className="mb-4">{user.bio}</p>
      <EchoStats likes={user.totalLikes} replies={user.totalReplies} shares={user.totalShares} />
      <div className="mt-4">
        <Button variant="outline" className="w-full">Edit Profile</Button>
      </div>
    </div>
  );
};

export default UserProfile;