import { Effect } from '../../schemas/BaseTalentSchema'

export const effectSamples: Effect[] = [
  {
    id: 'eff-self-str-add-5-3t',
    kind: 'stat-mod',
    target: 'self',
    stat: 'strength',
    op: 'add',
    value: 5,
    duration: { type: 'turns', amount: 3 },
    stacking: 'stack'
  },
  {
    id: 'eff-fire-dmg-30',
    kind: 'damage',
    target: 'enemy',
    damageType: 'fire',
    amount: 30,
    duration: { type: 'instant' }
  },
  {
    id: 'eff-ally-attack+10-2t',
    kind: 'stat-mod',
    target: 'ally',
    stat: 'attack',
    op: 'add',
    value: 10,
    duration: { type: 'turns', amount: 2 },
    stacking: 'refresh'
  },
  {
    id: 'eff-heal-ally-20',
    kind: 'heal',
    target: 'ally',
    amount: 20,
    duration: { type: 'seconds', amount: 2 }
  },
  {
    id: 'eff-tag-burning-2t',
    kind: 'tag',
    action: 'add',
    tag: 'burning',
    duration: { type: 'turns', amount: 2 }
  }
]

export default effectSamples
