import z from 'zod'

import { BaseAttributeSchema } from './shared/BaseAttributeSchema'

const HexColor = z.string().regex(/^#(?:[0-9a-fA-F]{6})$/, 'Expected hex color #RRGGBB')

const DurationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('instant') }),
  z.object({ type: z.literal('turns'), amount: z.number().int().positive() }),
  z.object({ type: z.literal('seconds'), amount: z.number().positive() })
])

const DiceExpression = z.string().regex(/^\d*d\d+([+-]\d+)?$/, 'Must be a dice expression like 1d8+2')

export const RequirementSchema = z.discriminatedUnion('kind', [
  z.object({ id: z.string().min(1).optional(), kind: z.literal('level'), min: z.number().int().positive() }),
  z.object({ id: z.string().min(1).optional(), kind: z.literal('stat'), stat: z.string().min(1), min: z.number() }),
  z.object({ id: z.string().min(1).optional(), kind: z.literal('talent'), talentId: z.string().min(1) }),
  z.object({
    id: z.string().min(1).optional(),
    kind: z.literal('tag'),
    tag: z.string().min(1),
    count: z.number().int().positive().optional()
  }),
  z.object({ id: z.string().min(1).optional(), kind: z.literal('class'), classId: z.string().min(1) })
])

export const CostComponentSchema = z.discriminatedUnion('kind', [
  z.object({
    id: z.string().min(1).optional(),
    kind: z.literal('resource'),
    resource: z.enum(['mana', 'stamina', 'gold', 'energy', 'item']),
    amount: z.number().nonnegative(),
    per: z.enum(['cast', 'turn', 'second']).default('cast').optional(),
    itemId: z.string().optional()
  }),
  z.object({
    id: z.string().min(1).optional(),
    kind: z.literal('cooldown'),
    turns: z.number().int().nonnegative()
  }),
  z.object({
    id: z.string().min(1).optional(),
    kind: z.literal('charges'),
    max: z.number().int().positive(),
    recharge: z.enum(['short-rest', 'long-rest', 'time']).optional()
  })
])

export const RaritySchema = z.object({
  id: z.string().min(1).optional(),
  tier: z.enum(['common', 'rare', 'legendary']).default('common'),
  weight: z.number().nonnegative().default(1), // drop weighting or selection weight
  color: HexColor.optional()
})

export const EffectSchema = z.discriminatedUnion('kind', [
  z.object({
    id: z.string().min(1).optional(),
    kind: z.literal('stat-mod'),
    target: z.enum(['self', 'ally', 'enemy']).default('enemy'),
    stat: z.string().min(1),
    op: z.enum(['add', 'mul', 'set']).default('add'),
    value: z.number(),
    duration: DurationSchema.default({ type: 'instant' })
  }),
  z.object({
    id: z.string().min(1).optional(),
    kind: z.literal('damage'),
    target: z.enum(['enemy', 'area']).default('enemy'),
    damageType: z.string().min(1),
    amount: z.union([z.number().positive(), DiceExpression]),
    duration: DurationSchema.default({ type: 'instant' })
  }),
  z.object({
    id: z.string().min(1).optional(),
    kind: z.literal('heal'),
    target: z.enum(['self', 'ally', 'area']).default('ally'),
    amount: z.union([z.number().positive(), DiceExpression]),
    duration: DurationSchema.default({ type: 'instant' })
  })
])

export const TalentSchema = BaseAttributeSchema.extend({
  isKeyTalent: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  requirements: z.array(RequirementSchema).default([]),
  costs: z.array(CostComponentSchema).default([]),
  rarity: RaritySchema.default({ tier: 'common', weight: 1 }),
  effects: z.array(EffectSchema).min(1),
  cooldown: z.number().int().nonnegative().default(0),
  rank: z.number().int().positive().default(1),
  maxRank: z.number().int().positive().default(1)
}).superRefine((val, ctx) => {
  if (val.rank > val.maxRank) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'rank cannot exceed maxRank', path: ['rank'] })
  }

  if (val.costs.length === 0 && val.cooldown === 0 && val.effects.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Talent must have at least one cost component if it has effects and no cooldown',
      path: ['costs']
    })
  }
})

export type Requirement = z.infer<typeof RequirementSchema>

export type CostComponent = z.infer<typeof CostComponentSchema>

export type Rarity = z.infer<typeof RaritySchema>

export type Effect = z.infer<typeof EffectSchema>

export type Talent = z.infer<typeof TalentSchema>
