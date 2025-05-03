import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import DashboardShell from "@/components/dashboard/DashboardShell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return <DashboardShell session={session}>{children}</DashboardShell>
}
