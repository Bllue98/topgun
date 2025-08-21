import { z } from 'zod'

export const reportSchema = z.object({
  title: z.string().nonempty({
    message: 'Title is required'
  }),
  date: z
    .string()
    .nonempty({
      message: 'Date is required'
    })
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format'
    }),
  shortDescription: z.string().nonempty({
    message: 'Short Description is required'
  }),
  longDescription: z.string().optional(),
  image: z.string().optional()
})

export type ReportData = z.infer<typeof reportSchema>
