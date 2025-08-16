import { z } from 'zod'

// Rarity enum
const RaritySchema = z.enum(['Common', 'Rare', 'Legendary'])

// Cost schema
const CostSchema = z.object({
  amount: z.number().default(0),
  resourceType: z.string().default('')
})

// Effect schema
const EffectSchema = z.object({
  effect: z.string().min(1, 'O efeito é obrigatório').default('Nenhum')
})

// Requisite schema (union of talent and stat requisites)
const RequisiteSchema = z.union([
  z.object({
    type: z.literal('talent')
  }),
  z.object({
    type: z.literal('stat'),
    stat: z.string().default(''),
    minimum: z.number().default(0)
  })
])

// Talent schema (blank)
const TalentSchema = z.object({
  id: z.string().default(''),
  name: z.string().default(''),
  description: z.string().default(''),
  cost: CostSchema,
  effect: z.array(EffectSchema).default([]),
  isTalentKey: z.boolean().default(false),
  rarity: RaritySchema.default('Common'),
  requisites: z.array(RequisiteSchema).default([])
})

const blankTalent = TalentSchema.parse({})

console.log(blankTalent)
