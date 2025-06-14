'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
  isOpen: boolean;
}
export default function Background({ children, isOpen }: Props) {
  const detailTaskRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const closeDetailTaskOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (!isOpen) return;

      const target = e.target as Node;

      const isInsideDetail = detailTaskRef.current?.contains(target);
      const modalPortal = document.querySelector('#modal-container');
      const isInsidePortal = modalPortal?.contains(target);

      if (!isInsideDetail && !isInsidePortal) {
        router.back();
      }
    },
    [isOpen, router]
  );

  useEffect(() => {
    document.addEventListener('mousedown', closeDetailTaskOutsideClick);
    return () => {
      document.removeEventListener('mousedown', closeDetailTaskOutsideClick);
    };
  }, [isOpen, closeDetailTaskOutsideClick]);

  return (
    <div>
      <div ref={detailTaskRef}>{children}</div>
    </div>
  );
}
