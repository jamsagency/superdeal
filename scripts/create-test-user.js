import { sql } from "@vercel/postgres"
import bcrypt from "bcrypt"

const EMAIL = "test@example.com"
const PASSWORD = "SecurePassword123!"
const NAME = "Test User"

async function createUser() {
  try {
    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(PASSWORD, saltRounds)

    // Insert the user into the database
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${NAME}, ${EMAIL}, ${hashedPassword})
      RETURNING id, name, email;
    `

    console.log("User created successfully:", result.rows[0])
  } catch (error) {
    console.error("Error creating user:", error)
  }
}

createUser()

