"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { AddPersonDialog } from "@/components/add-person-dialog"
import { EditPersonDialog } from "@/components/edit-person-dialog"
import { useSupabase } from "@/components/supabase-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface Person {
  id: string
  name: string
  email: string
  phone: string
  company: string
  user_id: string
  notes?: string
}

interface Deal {
  id: string
  name: string
  amount: number
  status: string
}

interface Task {
  id: string
  description: string
  status: string
  due_date: string
}

export function PeopleView() {
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
  const [isEditPersonOpen, setIsEditPersonOpen] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const { supabase } = useSupabase()

  useEffect(() => {
    fetchPeople()
  }, [])

  useEffect(() => {
    if (selectedPerson) {
      fetchDeals(selectedPerson.id)
      fetchTasks(selectedPerson.id)
    }
  }, [selectedPerson])

  async function fetchPeople() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/people")
      if (!response.ok) {
        throw new Error("Failed to fetch people")
      }
      const data = await response.json()
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

  async function fetchDeals(personId: string) {
    try {
      const response = await fetch(`/api/deals?personId=${personId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch deals")
      }
      const data = await response.json()
      setDeals(data)
    } catch (error) {
      console.error("Error fetching deals:", error)
    }
  }

  async function fetchTasks(personId: string) {
    try {
      const response = await fetch(`/api/tasks?personId=${personId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const handlePersonAdded = (newPerson: Person) => {
    setPeople([...people, newPerson])
    setSelectedPerson(newPerson)
  }

  const handlePersonEdited = (editedPerson: Person) => {
    setPeople(people.map((p) => (p.id === editedPerson.id ? editedPerson : p)))
    setSelectedPerson(editedPerson)
  }

  const handlePersonDeleted = async (personId: string) => {
    try {
      const response = await fetch(`/api/people/${personId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete person")
      }
      setPeople(people.filter((p) => p.id !== personId))
      setSelectedPerson(null)
    } catch (error) {
      console.error("Error deleting person:", error)
    }
  }

  const handleNotesChange = async (notes: string) => {
    if (!selectedPerson) return

    try {
      const response = await fetch(`/api/people/${selectedPerson.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      })
      if (!response.ok) {
        throw new Error("Failed to update notes")
      }
      const updatedPerson = { ...selectedPerson, notes }
      handlePersonEdited(updatedPerson)
    } catch (error) {
      console.error("Error updating notes:", error)
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
              <div className="flex items-center justify-between">
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
                <div>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditPersonOpen(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handlePersonDeleted(selectedPerson.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="deals">Deals</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
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
                </TabsContent>
                <TabsContent value="notes">
                  <Textarea
                    placeholder="Add notes here..."
                    value={selectedPerson.notes || ""}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="min-h-[200px]"
                  />
                </TabsContent>
                <TabsContent value="deals">
                  {deals.length === 0 ? (
                    <p>No deals yet.</p>
                  ) : (
                    <ul>
                      {deals.map((deal) => (
                        <li key={deal.id} className="mb-2">
                          <strong>{deal.name}</strong> - ${deal.amount} ({deal.status})
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
                <TabsContent value="tasks">
                  {tasks.length === 0 ? (
                    <p>No tasks yet.</p>
                  ) : (
                    <ul>
                      {tasks.map((task) => (
                        <li key={task.id} className="mb-2">
                          <strong>{task.description}</strong> - {task.status} (Due: {task.due_date})
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      <AddPersonDialog open={isAddPersonOpen} onOpenChange={setIsAddPersonOpen} onPersonAdded={handlePersonAdded} />

      {selectedPerson && (
        <EditPersonDialog
          open={isEditPersonOpen}
          onOpenChange={setIsEditPersonOpen}
          person={selectedPerson}
          onPersonEdited={handlePersonEdited}
        />
      )}
    </div>
  )
}

