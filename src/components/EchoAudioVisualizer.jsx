import React, { useRef, useEffect } from 'react';

const EchoAudioVisualizer = ({ audioSrc }) => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioContext.createAnalyser();

    audio.src = audioSrc;

    let audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        ctx.fillStyle = `rgb(50, ${barHeight + 100}, 50)`;
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    audio.play();
    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      audio.pause();
      audioContext.close();
    };
  }, [audioSrc]);

  return (
    <div>
      <canvas ref={canvasRef} width="300" height="100" />
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default EchoAudioVisualizer;