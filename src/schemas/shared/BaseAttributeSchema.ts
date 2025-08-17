import z from 'zod'

export const BaseAttributeSchema = z.object({
  id: z.coerce.number().positive().int().nullable().optional(),
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  icon: z.string().min(2).max(100).optional()
})

export type BaseAttribute = z.infer<typeof BaseAttributeSchema>
