import { z } from 'zod'

export const relatorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
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
  image: z.string().url('Image must be a valid URL').optional()
})

export type RelatoryData = z.infer<typeof relatorySchema>
