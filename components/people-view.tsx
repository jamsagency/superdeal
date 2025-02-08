"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { AddPersonDialog } from "@/components/add-person-dialog"
import { AddDealDialog } from "@/components/add-deal-dialog"
import { AddTaskDialog } from "@/components/add-task-dialog"

interface Person {
  id: string
  name: string
  email: string
  phone: string
  company: string
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
  const [deals, setDeals] = useState<Deal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
  const [isAddDealOpen, setIsAddDealOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const peopleResponse = await fetch("/api/people")
        if (!peopleResponse.ok) {
          throw new Error("Failed to fetch people")
        }
        const peopleData = await peopleResponse.json()
        setPeople(peopleData)
        if (peopleData.length > 0) {
          setSelectedPerson(peopleData[0])
        }
      } catch (error) {
        console.error("Error fetching people:", error)
        setError("Failed to load people. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedPerson) {
      fetchDealsAndTasks(selectedPerson.id)
    }
  }, [selectedPerson])

  async function fetchDealsAndTasks(personId: string) {
    try {
      const [dealsResponse, tasksResponse] = await Promise.all([
        fetch(`/api/deals?personId=${personId}`),
        fetch(`/api/tasks?personId=${personId}`),
      ])

      if (!dealsResponse.ok || !tasksResponse.ok) {
        throw new Error("Failed to fetch deals or tasks")
      }

      const [dealsData, tasksData] = await Promise.all([dealsResponse.json(), tasksResponse.json()])

      setDeals(dealsData)
      setTasks(tasksData)
    } catch (error) {
      console.error("Error fetching deals and tasks:", error)
      setError("Failed to load deals and tasks. Please try again.")
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
            <CardDescription>Manage your contacts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-15rem)]">
              {people.map((person) => (
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
              ))}
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
                    <CardDescription>{selectedPerson.company}</CardDescription>
                  </div>
                </div>
                <Button variant="outline">Edit person</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-1">
                      <div className="text-sm">{selectedPerson.email}</div>
                      <div className="text-sm">{selectedPerson.phone}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Deals</h3>
                      <Button variant="outline" size="sm" onClick={() => setIsAddDealOpen(true)}>
                        Add Deal
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {deals.map((deal) => (
                        <div key={deal.id} className="flex items-center justify-between">
                          <span className="text-sm">{deal.name}</span>
                          <Badge variant={deal.status === "closed" ? "secondary" : "default"}>{deal.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Tasks</h3>
                      <Button variant="outline" size="sm" onClick={() => setIsAddTaskOpen(true)}>
                        Add Task
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between">
                          <span className="text-sm">{task.description}</span>
                          <Badge variant={task.status === "done" ? "secondary" : "default"}>{task.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      <AddPersonDialog
        open={isAddPersonOpen}
        onOpenChange={setIsAddPersonOpen}
        onPersonAdded={(newPerson) => setPeople([...people, newPerson])}
      />
      <AddDealDialog
        open={isAddDealOpen}
        onOpenChange={setIsAddDealOpen}
        personId={selectedPerson?.id}
        onDealAdded={(newDeal) => setDeals([...deals, newDeal])}
      />
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        personId={selectedPerson?.id}
        onTaskAdded={(newTask) => setTasks([...tasks, newTask])}
      />
    </div>
  )
}

