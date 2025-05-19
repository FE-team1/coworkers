export default function TaskListPageLayout({
  children,
  detailTask,
}: Readonly<{
  children: React.ReactNode;
  detailTask: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {detailTask}
    </>
  );
}
