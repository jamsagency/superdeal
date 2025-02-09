"use client"

import Link from "next/link"
import { Search, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSupabase } from "@/components/supabase-provider"

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { user, supabase } = useSupabase()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error)
    } else {
      router.push("/login")
    }
  }

  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <Link href="/app/people" className="font-semibold text-xl">
          Superdeal
        </Link>

        <nav className="flex items-center gap-4 mx-6">
          {[
            { name: "People", path: "/app/people" },
            { name: "Deals", path: "/app/deals" },
            { name: "Tasks", path: "/app/tasks" },
          ].map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.path
                  ? "text-foreground font-semibold underline underline-offset-4"
                  : "text-muted-foreground",
              )}
              asChild
            >
              <Link href={item.path}>{item.name}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="outline"
            className="w-64 justify-start text-sm text-muted-foreground"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search (cmd + K)
          </Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search people, deals, and tasks..." />
            <CommandList>{/* Command items will be added later */}</CommandList>
          </CommandDialog>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{user?.email ? user.email.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{user?.email || "Not logged in"}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

