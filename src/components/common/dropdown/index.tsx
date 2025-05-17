'use client';

import { JSX, ReactNode } from 'react';
import clsx from 'clsx';
import { useOutSideClickAutoClose } from '@/utils/use-outside-click-auto-close';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type OptionsType = ReactNode[] | string[];

export interface DropDownProps {
  onSelect?: (e: React.MouseEvent<HTMLDivElement>) => void;
  options: OptionsType;
  size: Size;
  dropDownOpenBtn?: JSX.Element;
  footerBtn?: ReactNode;
  placement: string;
}

export default function DropDown({
  onSelect,
  dropDownOpenBtn,
  options,
  size,
  footerBtn = null,
  placement,
}: DropDownProps) {
  const { ref, isOpen, setIsOpen } = useOutSideClickAutoClose(false);

  const hashedIndex = size.charCodeAt(0) % options.length;

  const handleClickOption = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(false);
    onSelect?.(e);
  };

  return (
    <div className="relative h-fit w-fit" ref={ref}>
      <div
        className="cursor-pointer"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        {dropDownOpenBtn}
      </div>

      {isOpen && (
        <div
          className={clsx(
            'bg-bg200 border-border absolute z-100 rounded-lg border p-2',
            size === 'xl' && 'h-fit px-4 py-4',
            footerBtn && 'flex flex-col gap-4',
            placement
          )}
        >
          <div className="max-h-120 cursor-pointer overflow-auto">
            {options.map((option, idx) => {
              return (
                <div
                  className={clsx(
                    'hover:bg-bg100 flex items-center justify-center rounded-lg',
                    size === 'xs' && 'text-xs-rg h-10 w-[94px]',
                    size === 'sm' && 'text-md-rg h-10 w-[109px]',
                    size === 'md' && 'text-md-rg h-10 w-30',
                    size === 'lg' && 'text-lg-rg h-[47px] w-[135px]'
                  )}
                  onClick={handleClickOption}
                  key={hashedIndex + idx}
                >
                  {option}
                </div>
              );
            })}
          </div>
          {footerBtn}
        </div>
      )}
    </div>
  );
}
