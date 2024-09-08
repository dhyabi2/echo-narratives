import React, { useState, useEffect } from 'react';
import { getComments, addComment } from '../lib/db';
import VoiceCommentForm from './VoiceCommentForm';
import AudioPlayer from './AudioPlayer';

const EchoComments = ({ echoId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(echoId);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [echoId]);

  const handleAddComment = async (audioBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64AudioComment = reader.result;
      const addedComment = await addComment(echoId, base64AudioComment);
      setComments([...comments, addedComment]);
    };
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Voice Comments</h3>
      <VoiceCommentForm onCommentAdded={handleAddComment} />
      <div className="space-y-4 mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
            <AudioPlayer src={comment.audioData} />
            <p className="text-xs text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EchoComments;