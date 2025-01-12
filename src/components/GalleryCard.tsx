import { FC, useState, useRef, useEffect } from 'react';
import { MediaItem } from '../features/media/media.types';
import { PlayIcon } from '@heroicons/react/16/solid';

interface GalleryCardProps {
  item: MediaItem;
}

const GalleryCard: FC<GalleryCardProps> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isVideo = (url: string) => {
    return /(\.mov|\.mp4|\.webm|\.avi)$/i.test(url);
  };

  useEffect(() => {
    if (isVideo(item.mediaFile)) {
      const video = document.createElement('video');
      video.src = item.mediaFile;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      
      video.onloadeddata = () => {
        video.currentTime = 0;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          setThumbnail(thumbnailUrl);
        }
        video.remove();
      };
    }
  }, [item.mediaFile]);

  const handleMediaClick = () => {
    if (!isVideo(item.mediaFile)) {
      console.log('Image clicked:', item.mediaFile);
      return;
    }

    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div 
        className="block w-full cursor-pointer"
        onClick={handleMediaClick}
      >
        <div className="w-full aspect-square bg-white rounded-2xl shadow-lg relative overflow-hidden">
          {isVideo(item.mediaFile) ? (
            <div className="relative w-full h-full">
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={item.mediaFile}
                playsInline
                onEnded={() => setIsPlaying(false)}
                poster={thumbnail || undefined}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 bg-black">
                  <PlayIcon className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          ) : (
            <img 
              src={item.mediaFile}
              alt={item.mediaAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 px-1">
        <h3 className="text-white text-lg font-semibold truncate">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">{item.location}</span>
          <span className="text-gray-400 text-sm">{item.authorName}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {item.category.map((cat) => (
            <span 
              key={cat}
              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;