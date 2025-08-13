import type React from "react"
import { RecruiterLayout } from "./(components)/RecruiterLayout"


export default function Layout({ children }: { children: React.ReactNode }) {
  return <RecruiterLayout>{children}</RecruiterLayout>
  
}
