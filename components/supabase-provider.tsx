"use client"

import { createContext, useContext, useEffect, useState } from "react"
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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return <SupabaseContext.Provider value={{ user, session }}>{children}</SupabaseContext.Provider>
}

export const useSupabase = () => useContext(SupabaseContext)

