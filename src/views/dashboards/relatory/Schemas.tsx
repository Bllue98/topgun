import { z } from 'zod'

export const relatorySchema = z.object({
  title: z.coerce.string().trim().min(1, 'Title is required'),
  date: z.string().refine(
    val => {
      if (!val) return true

      return !isNaN(Date.parse(val))
    },
    {
      message: 'Invalid date format'
    }
  ),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  image: z.string().optional()
})

export type RelatoryData = z.infer<typeof relatorySchema>
