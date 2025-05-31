import clsx from 'clsx';

export default function ModalHeading({
  className,
  children,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={clsx('text-lg-md text-center break-keep whitespace-normal', className)}
      {...props}
    >
      {children}
    </h2>
  );
}
