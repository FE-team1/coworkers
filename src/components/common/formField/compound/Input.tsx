'use client';

import clsx from 'clsx';
import { COMMON_TEXTFIELD_STYLE } from '../style';
import { InputProps } from '../type';

export default function Input({
  leftSlot = null,
  rightSlot = null,
  borderClassName = 'border-border',
  className,
  ref,
  ...rest
}: InputProps) {
  return (
    <div
      className={clsx(
        'bg-bg200 flex h-11 w-full gap-3 rounded-xl border px-4 py-2.5 sm:h-12',
        borderClassName,
        className
      )}
    >
      {leftSlot}

      <input
        className={clsx('w-full', COMMON_TEXTFIELD_STYLE)}
        onFocus={rest.onFocus}
        onBlur={rest.onBlur}
        ref={ref}
        {...rest}
      />

      {rightSlot}
    </div>
  );
}
