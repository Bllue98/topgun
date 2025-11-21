import { z } from 'zod'

const HexColor = z.string().regex(/^#(?:[0-9a-fA-F]{6})$/, 'Color must be a hex value like #RRGGBB')

export const raritySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: HexColor.optional().default('#000000'),
  weight: z
    .number({ invalid_type_error: 'Weight must be a number' })
    .nonnegative({ message: 'Weight must be >= 0' })
    .default(1)
})

export const rarityItemSchema = raritySchema.extend({ id: z.string().min(1).optional() })


export type RarityFormValues = z.infer<typeof raritySchema>
export type RarityItem = z.infer<typeof rarityItemSchema>

export default raritySchema
