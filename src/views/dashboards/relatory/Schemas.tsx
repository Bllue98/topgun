import { z } from 'zod'

export const cardSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  date: z.string().min(1, 'A data é obrigatória'),
  shortDescription: z.string().min(1, 'A descrição curta é obrigatória'),
  longDescription: z.string().optional(),
  image: z.string().optional()
})

// Se quiser, pode exportar o tipo TypeScript também
export type CardData = z.infer<typeof cardSchema>
