import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl font-bold">Welcome to Superdeal</h1>
      <p className="text-xl text-center max-w-2xl">
        The first CRM that focuses on people and deals. Manage your contacts, track your deals, and boost your
        productivity.
      </p>
      <Button asChild size="lg">
        <Link href="/login">Log in</Link>
      </Button>
    </div>
  )
}

