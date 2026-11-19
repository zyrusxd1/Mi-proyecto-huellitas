import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EADFCB] text-[#5C4E41] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <PawPrint className="w-8 h-8 text-[#C4572F] mb-2" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-sm font-medium text-[#2B2118] max-w-[18ch] truncate">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};
