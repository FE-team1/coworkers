'use client';

import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import CommentSubmit from '@/assets/CommentSubmit';

export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    scrollContainerRef.current = container;

    const handleScroll = () => {
      setIsVisible(container.scrollTop > 100);
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    container.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      container.removeEventListener('scroll', debouncedHandleScroll);
      debouncedHandleScroll.cancel();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="animate-scale-in fixed right-[7%] bottom-20 z-[200] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full sm:h-10 sm:w-10">
      <CommentSubmit
        width="40"
        height="40"
        disabled={false}
        className="text-primary"
        onClick={scrollToTop}
      />
    </div>
  );
}
