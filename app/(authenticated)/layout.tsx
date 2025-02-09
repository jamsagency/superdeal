"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { TopNav } from "@/components/top-nav"
import type React from "react" // Added import for React

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}

