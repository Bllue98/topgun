import { z } from 'zod'

export const relatorySchema = z.object({
  title: z.string({
    required_error: 'Please enter a title',
    invalid_type_error: 'Please enter a valid title'
  }),
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
