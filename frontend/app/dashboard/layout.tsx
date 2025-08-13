import type React from "react"
import { UserDashboardLayout } from "@/app/dashboard/(components)/DashboardLayout"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>
}
