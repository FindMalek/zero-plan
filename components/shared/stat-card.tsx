export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg bg-white p-10 text-center shadow-sm dark:bg-gray-800">
      <span className="text-3xl font-bold">{value}</span>
      <span className="pt-2 font-mono text-sm text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </div>
  )
}
