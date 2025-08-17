import { Talent } from '../../schemas/BaseTalentSchema'
import { requirementSamples } from './requirements'
import { costSamples } from './costs'
import { raritySamples } from './rarities'
import { effectSamples } from './effects'

export const talentSamples: Talent[] = [
  {
    id: 1,
    name: 'Firebolt',
    description: 'Hurl a bolt of fire at an enemy',
    isKeyTalent: false,
    tags: ['pyromancy', 'ranged'],
    category: 'Offense',
    requirements: [
      requirementSamples.find(r => r.id === 'req-level-3')!,
      requirementSamples.find(r => r.id === 'req-tag-pyromancy-1')!
    ],
    costs: [costSamples.find(c => c.id === 'cost-mana-20-cast')!, costSamples.find(c => c.id === 'cooldown-2')!],
    rarity: raritySamples.find(r => r.id === 'rarity-uncommon')!,
    effects: [effectSamples.find(e => e.id === 'eff-fire-dmg-30')!],
    cooldown: 0,
    rank: 1,
    maxRank: 5
  },
  {
    id: 2,
    name: 'Battle Cry',
    description: 'Bolster allies with a powerful shout',
    isKeyTalent: true,
    tags: ['support', 'buff'],
    category: 'Support',
    requirements: [requirementSamples.find(r => r.id === 'req-cha-12')!],
    costs: [costSamples.find(c => c.id === 'cost-stamina-5-turn')!],
    rarity: raritySamples.find(r => r.id === 'rarity-rare')!,
    effects: [effectSamples.find(e => e.id === 'eff-ally-attack+10-2t')!],
    cooldown: 1,
    rank: 1,
    maxRank: 3
  },
  {
    id: 3,
    name: 'Shadow Brand',
    description: 'Mark an enemy with a shadowy curse',
    isKeyTalent: false,
    tags: ['debuff', 'shadow'],
    category: 'Control',
    requirements: [requirementSamples.find(r => r.id === 'req-talent-basic-casting')!],
    costs: [costSamples.find(c => c.id === 'cost-mana-10-cast')!],
    rarity: raritySamples.find(r => r.id === 'rarity-epic')!,
    effects: [effectSamples.find(e => e.id === 'eff-tag-burning-2t')!],
    cooldown: 0,
    rank: 1,
    maxRank: 1
  }
]

export default talentSamples
