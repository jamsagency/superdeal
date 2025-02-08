import { TopNav } from "@/components/top-nav"
import type React from "react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}

