import clsx from 'clsx';

export default function ModalDescription({
  className,
  children,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={clsx(
        'text-gray300 text-sm-md text-center break-keep whitespace-normal',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
