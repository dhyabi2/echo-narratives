import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { createPlaylist } from '../lib/db';

const PlaylistCreator = ({ onPlaylistCreated }) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlaylist = await createPlaylist({ name: playlistName, echoes: [] });
    setPlaylistName('');
    onPlaylistCreated(newPlaylist);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <Button type="submit">Create Playlist</Button>
    </form>
  );
};

export default PlaylistCreator;