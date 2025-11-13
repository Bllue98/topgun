import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters' })
})

export type LoginForm = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters' }),
  agree: z.boolean().refine(val => val === true, { message: 'You must accept the terms' })
})

export type RegisterForm = z.infer<typeof registerSchema>
