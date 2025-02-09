"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { AddPersonDialog } from "@/components/add-person-dialog"
import { useSupabase } from "@/components/supabase-provider"

interface Person {
  id: string
  name: string
  email: string
  phone: string
  company: string
}

export function PeopleView() {
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
  const { supabase } = useSupabase()

  useEffect(() => {
    fetchPeople()
  }, [])

  async function fetchPeople() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("people").select("*").order("name", { ascending: true })

      if (error) throw error

      setPeople(data)
      if (data.length > 0) {
        setSelectedPerson(data[0])
      }
    } catch (error) {
      console.error("Error fetching people:", error)
      setError("Failed to load people. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">People</h1>
        <Button onClick={() => setIsAddPersonOpen(true)}>Add Person</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-15rem)]">
              {people.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No contacts yet. Add your first contact!</div>
              ) : (
                people.map((person) => (
                  <Button
                    key={person.id}
                    variant="ghost"
                    className={`w-full justify-start rounded-none ${selectedPerson?.id === person.id ? "bg-muted" : ""}`}
                    onClick={() => setSelectedPerson(person)}
                  >
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${person.name}`}
                        alt={person.name}
                      />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {person.name}
                  </Button>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedPerson && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedPerson.name}`}
                    alt={selectedPerson.name}
                  />
                  <AvatarFallback>{selectedPerson.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedPerson.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedPerson.company}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p className="text-sm">{selectedPerson.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Phone</h3>
                  <p className="text-sm">{selectedPerson.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Company</h3>
                  <p className="text-sm">{selectedPerson.company}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AddPersonDialog
        open={isAddPersonOpen}
        onOpenChange={setIsAddPersonOpen}
        onPersonAdded={(newPerson) => {
          setPeople([...people, newPerson])
          setSelectedPerson(newPerson)
        }}
      />
    </div>
  )
}

