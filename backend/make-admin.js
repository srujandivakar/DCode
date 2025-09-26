import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

async function makeUserAdmin() {
  try {
    // Update the test user to admin role
    const user = await prisma.user.update({
      where: { email: 'test@test.com' },
      data: { role: 'ADMIN' }
    })
    
    console.log('User updated to admin:', user.email, user.role)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makeUserAdmin()