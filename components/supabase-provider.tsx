"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"

type SupabaseContextType = {
  user: User | null
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
})

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      // Only redirect if we're on a protected route and there's no session
      const isProtectedRoute = pathname?.startsWith("/app")
      if (isProtectedRoute && !session) {
        router.push("/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router])

  return <SupabaseContext.Provider value={{ user, session }}>{children}</SupabaseContext.Provider>
}

export const useSupabase = () => useContext(SupabaseContext)

