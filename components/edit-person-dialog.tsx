"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Person {
  id: string
  name: string
  email: string
  phone: string
  company: string
}

interface EditPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: Person
  onPersonEdited: (person: Person) => void
}

export function EditPersonDialog({ open, onOpenChange, person, onPersonEdited }: EditPersonDialogProps) {
  const [name, setName] = useState(person.name)
  const [email, setEmail] = useState(person.email)
  const [phone, setPhone] = useState(person.phone)
  const [company, setCompany] = useState(person.company)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setName(person.name)
    setEmail(person.email)
    setPhone(person.phone)
    setCompany(person.company)
  }, [person])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/people/${person.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, company }),
      })

      if (!response.ok) {
        throw new Error("Failed to update person")
      }

      const updatedPerson = await response.json()
      onPersonEdited(updatedPerson)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating person:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Person"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

