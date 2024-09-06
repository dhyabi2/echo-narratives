import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

const EchoPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const visualize = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 2;
          ctx.fillStyle = `rgb(50, ${barHeight + 100}, 50)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      };
      draw();
    };

    if (isPlaying) {
      audio.play();
      visualize();
    } else {
      audio.pause();
      cancelAnimationFrame(animationId);
    }

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, audioUrl]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} />
      <canvas ref={canvasRef} width="300" height="100" />
      <Button onClick={togglePlayPause}>
        {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
};

export default EchoPlayer;