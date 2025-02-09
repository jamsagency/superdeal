import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"

config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const EMAIL = "j@jams.agency"
const PASSWORD = "jams"
const NAME = "Jams"

async function createUser() {
  // First, create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  })

  if (authError) {
    console.error("Error creating user in Auth:", authError)
    return
  }

  console.log("User created in Auth successfully:", authData.user)

  // Then, insert the user into the public.users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([{ id: authData.user.id, name: NAME, email: EMAIL }])

  if (userError) {
    console.error("Error inserting user into public.users:", userError)
  } else {
    console.log("User inserted into public.users successfully:", userData)
  }
}

createUser()

