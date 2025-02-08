"use client"

import { createContext, useContext, useState, type PropsWithChildren } from "react"
import { supabase } from "@/lib/supabase-client"

interface SupabaseContext {
  session: any | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContext>({ session: null, loading: true })

export function SupabaseProvider({ children }: PropsWithChildren<{}>) {
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.getSession()
    session.then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      listener.unsubscribe()
    }
  }, [])

  return <SupabaseContext.Provider value={{ session, loading }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === null) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}

