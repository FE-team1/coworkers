'use client';

import { useState } from 'react';
import HeartIcon from './HeartIcon';

interface LikeToggleButtonProps {
  isLiked?: boolean;
  initialCount?: number;
}

export default function LikeToggleButton({
  isLiked = false,
  initialCount = 0,
}: LikeToggleButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(initialCount);

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setCount((prev) => prev + 1);
    }
  };

  return (
    <button type="button" onClick={toggleLike} className="flex items-center gap-1">
      <HeartIcon filled={liked} size={16} />
      <span className="text-xs-rg sm:text-md-rg text-gray400">
        {count > 9999 ? '9999+' : count}
      </span>
    </button>
  );
}
