import React, { useRef, useEffect } from 'react';

const AudioWaveform = ({ progress }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the waveform
    ctx.beginPath();
    for (let i = 0; i < width; i++) {
      const x = i;
      const y = height / 2 + Math.sin(i * 0.1) * 20;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    // Draw the progress
    const progressWidth = (progress / 100) * width;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.fillRect(0, 0, progressWidth, height);
  }, [progress]);

  return <canvas ref={canvasRef} className="w-full h-24" />;
};

export default AudioWaveform;