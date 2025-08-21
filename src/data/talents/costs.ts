import { CostComponent } from '../../schemas/BaseTalentSchema'

export const costSamples: CostComponent[] = [
  {
    id: 'cost-mana-20-cast',
    kind: 'resource',
    resource: 'mana',
    amount: 20,
    per: 'cast'
  },
  {
    id: 'cost-mana-10-cast',
    kind: 'resource',
    resource: 'mana',
    amount: 10,
    per: 'cast'
  },
  {
    id: 'cost-stamina-5-turn',
    kind: 'resource',
    resource: 'stamina',
    amount: 5,
    per: 'turn'
  },
  {
    id: 'cost-item-potion-1',
    kind: 'resource',
    resource: 'item',
    amount: 1,
    per: 'cast',
    itemId: 'health-potion'
  },
  {
    id: 'cooldown-3',
    kind: 'cooldown',
    turns: 3
  },
  {
    id: 'cooldown-2',
    kind: 'cooldown',
    turns: 2
  },
  {
    id: 'charges-2-short-rest',
    kind: 'charges',
    max: 2,
    recharge: 'short-rest'
  }
]

export default costSamples
