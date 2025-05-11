export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-secondary flex h-[200px] w-full flex-col items-center justify-center rounded-lg p-10 text-center shadow-sm">
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-secondary-foreground/70 pt-2 font-mono text-sm">
        {label}
      </span>
    </div>
  )
}
