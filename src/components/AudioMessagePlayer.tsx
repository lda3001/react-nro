// components/AudioMessagePlayer.tsx
import React, { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioMessagePlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = parseFloat(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === undefined) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const setTotal = () => {
      if (audio.readyState >= 1) {
        const duration = audio.duration;
        if (!isNaN(duration) && duration !== Infinity) {
          setDuration(duration);
          setIsLoaded(true);
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      setTotal();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', setTotal);
    audio.addEventListener('ended', handleEnded);

    // Initial duration check
    setTotal();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', setTotal);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="flex items-center space-x-3 max-w-xs p-2">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button onClick={togglePlay}>{isPlaying ? '⏸️' : '▶️'}</button>
      <input
        type="range"
        min="0"
        max={isLoaded ? duration : 0}
        step="0.1"
        value={currentTime}
        onChange={handleSeek}
        className="w-12"
      />
      <span className="text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
    </div>
  );
};

export default AudioMessagePlayer;
