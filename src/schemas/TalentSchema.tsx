import { z } from 'zod'

// base
export const talentBaseInfoSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória')
})

// effects
export const talentEffectSchema = z.object({
  effect: z.string().min(1, 'O efeito é obrigatório').default('Nenhum'),
  cost: z.string().optional().default('Nenhum')
})

// rarity
export const talentMetaSchema = z.object({
  rarity: z.enum(['Comum', 'Raro', 'Lendário']).default('Comum'),
  isKeyTalent: z.boolean().default(false)
})

// Requisites (attribute requirements)
export const talentRequisitesSchema = z.record(z.number().min(0)).optional().default({})

// Full Talent schema
export const talentSchema = talentBaseInfoSchema.merge(talentEffectSchema).merge(talentMetaSchema).extend({
  requisites: talentRequisitesSchema
})

export type TalentData = z.infer<typeof talentSchema>
