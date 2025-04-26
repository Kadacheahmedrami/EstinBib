import * as LucideIcons from "lucide-react"

interface DashboardCardProps {
  title: string
  value: number | string
  icon: keyof typeof LucideIcons
  color?: "default" | "green" | "blue" | "red" | "yellow"
}

export default function DashboardCard({ title, value, icon, color = "default" }: DashboardCardProps) {
  const Icon: LucideIcons.LucideIcon = LucideIcons[icon] as LucideIcons.LucideIcon

  const colorClasses = {
    default: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}
