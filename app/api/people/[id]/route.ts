import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const personId = params.id

  try {
    const body = await req.json()
    const { data, error } = await supabase.from("people").update(body).eq("id", personId).eq("user_id", userId).select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating person:", error)
    return NextResponse.json({ error: "Error updating person" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const personId = params.id

  try {
    const { error } = await supabase.from("people").delete().eq("id", personId).eq("user_id", userId)

    if (error) throw error

    return NextResponse.json({ message: "Person deleted successfully" })
  } catch (error) {
    console.error("Error deleting person:", error)
    return NextResponse.json({ error: "Error deleting person" }, { status: 500 })
  }
}

