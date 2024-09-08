import React, { useState, useEffect } from 'react';
import { getComments, addComment } from '../lib/db';
import { Button } from './ui/button';
import AudioRecorder from './AudioRecorder';
import AudioPlayer from './AudioPlayer';

const EchoComments = ({ echoId }) => {
  const [comments, setComments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(echoId);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [echoId]);

  const handleAddComment = async (audioBlob) => {
    if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64AudioComment = reader.result;
        const addedComment = await addComment({
          echoId,
          audioData: base64AudioComment,
          createdAt: new Date().toISOString()
        });
        setComments([...comments, addedComment]);
      };
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-2 rounded">
            <AudioPlayer src={comment.audioData} />
            <p className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {isRecording ? (
        <AudioRecorder onAudioRecorded={(blob) => {
          handleAddComment(blob);
          setIsRecording(false);
        }} />
      ) : (
        <Button onClick={() => setIsRecording(true)}>Record Comment</Button>
      )}
    </div>
  );
};

export default EchoComments;