import React, { useRef, useEffect } from 'react';

const AudioWaveform = ({ audioUrl, isPlaying }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let animationFrameId;

    const drawWaveform = (audioBuffer) => {
      const data = audioBuffer.getChannelData(0);
      const step = Math.ceil(data.length / canvas.width);
      const amp = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, amp);

      for (let i = 0; i < canvas.width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          const datum = data[(i * step) + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
        ctx.lineTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }

      ctx.strokeStyle = '#3b82f6';
      ctx.stroke();
    };

    const animate = () => {
      // Add animation logic here if needed
      animationFrameId = requestAnimationFrame(animate);
    };

    fetch(audioUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        drawWaveform(audioBuffer);
        if (isPlaying) {
          animate();
        }
      });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioUrl, isPlaying]);

  return <canvas ref={canvasRef} className="w-full h-24" />;
};

export default AudioWaveform;