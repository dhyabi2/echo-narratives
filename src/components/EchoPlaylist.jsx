import React from 'react';
import { usePlaylist } from '../hooks/usePlaylist';
import EchoList from './EchoList';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const EchoPlaylist = ({ playlistId }) => {
  const { playlist, addEchoToPlaylist, removeEchoFromPlaylist, isLoading, error } = usePlaylist(playlistId);

  if (isLoading) return <div>Loading playlist...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{playlist.name}</h2>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Echo
      </Button>
      <EchoList
        echoes={playlist.echoes}
        onRemove={(echoId) => removeEchoFromPlaylist(echoId)}
      />
    </div>
  );
};

export default EchoPlaylist;