import React from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useFollow } from '../hooks/useFollow';

const FollowButton = ({ userId }) => {
  const { user } = useAuth();
  const { isFollowing, toggleFollow, isLoading } = useFollow(user.uid, userId);

  return (
    <Button onClick={toggleFollow} disabled={isLoading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;