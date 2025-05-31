import clsx from 'clsx';

export default function ModalFooter({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={clsx('flex justify-center gap-2', className)} {...props}>
      {children}
    </div>
  );
}
