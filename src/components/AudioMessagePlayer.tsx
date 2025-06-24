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
  const [error, setError] = useState<string>('');

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Reset error state when trying to play
      setError('');
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Không thể phát audio. Vui lòng thử lại.');
        setIsPlaying(false);
      });
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

    const handleError = (e: Event) => {
      // console.error('Audio error:', e);
      // setError('Có lỗi xảy ra khi tải audio.');
      // setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', setTotal);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Initial duration check
    setTotal();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', setTotal);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-2 max-w-xs p-2 bg-gray-100 rounded-lg">
      <div className="flex items-center space-x-3">
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          preload="metadata"
          
          playsInline
          controls={false}
        />
        <button 
          onClick={togglePlay}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={isLoaded ? duration : 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-blue-500 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <span className="text-xs whitespace-nowrap text-blue-600">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
      {/* {error && (
        <div className="text-red-500 text-xs">{error}</div>
      )} */}
    </div>
  );
};

export default AudioMessagePlayer;
