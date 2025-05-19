export function DateSkeleton() {
  return (
    <section className="flex items-center gap-3">
      <div className="bg-gray200 h-6 w-24 rounded-md" />
      <div className="flex gap-1">
        <div className="bg-gray200 h-4 w-4 rounded" />
        <div className="bg-gray200 h-4 w-4 rounded" />
      </div>
      <div className="bg-gray200 h-6 w-6 rounded" />
    </section>
  );
}

export function TaskListsSkeleton() {
  return (
    <section>
      <ol className="flex h-fit max-w-full gap-3 overflow-x-auto overflow-y-hidden">
        {[...Array(4)].map((_, i) => (
          <li key={i} className="bg-gray200 h-6 w-20 shrink-0 rounded" />
        ))}
      </ol>
    </section>
  );
}

export function TaskSkeleton() {
  return (
    <section>
      <div className="mb-20 flex h-full w-full flex-col items-center justify-start overflow-auto lg:mb-30 xl:mb-50">
        <ol className="flex h-full w-full flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="bg-gray200 h-24 w-full rounded-lg" />
          ))}
        </ol>
      </div>
    </section>
  );
}
