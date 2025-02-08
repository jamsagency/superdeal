import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, "..", ".env.local") })

console.log("Environment variables:")
console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "[REDACTED]" : "undefined")

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL and SUPABASE_KEY must be set in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const EMAIL = "test@example.com"
const PASSWORD = "SecurePassword123!"
const NAME = "Test User"

async function createUser() {
  try {
    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(PASSWORD, saltRounds)

    // Insert the user into the database
    const { data, error } = await supabase
      .from("users")
      .insert([{ name: NAME, email: EMAIL, password: hashedPassword }])
      .select()

    if (error) {
      console.error("Error creating user:", error)
      if (error.code === "23505") {
        console.log("A user with this email already exists.")
      } else {
        console.log("Please check your Supabase RLS policies and table permissions.")
      }
      return
    }

    console.log("User created successfully:", data[0])
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

createUser()

