import { Rarity } from '../../schemas/BaseTalentSchema'

export const raritySamples: Rarity[] = [
  { id: 'rarity-common', tier: 'common', weight: 1, color: '#A0A0A0' },
  { id: 'rarity-uncommon', tier: 'uncommon', weight: 0.7, color: '#4CAF50' },
  { id: 'rarity-rare', tier: 'rare', weight: 0.3, color: '#2196F3' },
  { id: 'rarity-epic', tier: 'epic', weight: 0.1, color: '#9C27B0' },
  { id: 'rarity-legendary', tier: 'legendary', weight: 0.02, color: '#FFC107' }
]

export default raritySamples
