"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"

type SupabaseContextType = {
  user: User | null
  session: Session | null
  supabase: typeof supabase
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  supabase: supabase,
})

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const setServerSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setSession(session)
        setUser(session.user)
      }
    }

    setServerSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return <SupabaseContext.Provider value={{ user, session, supabase }}>{children}</SupabaseContext.Provider>
}

export const useSupabase = () => useContext(SupabaseContext)

