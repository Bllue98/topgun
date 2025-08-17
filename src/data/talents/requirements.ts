import { Requirement } from '../../schemas/BaseTalentSchema'

export const requirementSamples: Requirement[] = [
  { id: 'req-level-5', kind: 'level', min: 5 },
  { id: 'req-str-10', kind: 'stat', stat: 'strength', min: 10 },
  { id: 'req-level-3', kind: 'level', min: 3 },
  { id: 'req-cha-12', kind: 'stat', stat: 'charisma', min: 12 },
  { id: 'req-talent-basic-casting', kind: 'talent', talentId: 'basic-casting' },
  { id: 'req-tag-pyromancy-2', kind: 'tag', tag: 'pyromancy', count: 2 },
  { id: 'req-tag-pyromancy-1', kind: 'tag', tag: 'pyromancy', count: 1 },
  { id: 'req-class-mage', kind: 'class', classId: 'mage' }
]

export default requirementSamples
