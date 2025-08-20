import React from 'react'
import { useWatch } from 'react-hook-form'
import { MenuItem } from '@mui/material'
import SharedTextField from '../shared-inputs/SharedTextField'

interface Props {
  control: any
}

const CostsSection: React.FC<Props> = ({ control }) => {
  const cost = useWatch({ control, name: 'costs[0]' }) || { resource: 'none' }
  const resource = cost.resource ?? 'none'

  return (
    <>
      {/* Resource Selection */}
      <SharedTextField control={control} name='costs[0].resource' label='Cost' select>
        <MenuItem value='ether'>Ether</MenuItem>
        <MenuItem value='stamina'>Stamina</MenuItem>
        <MenuItem value='none'>None</MenuItem>
      </SharedTextField>

      {/* Conditional fields */}
      {(resource === 'ether' || resource === 'stamina') && (
        <SharedTextField control={control} name='costs[0].amount' label='Amount' type='number' />
      )}

      {(resource === 'ether' || resource === 'stamina' || resource === 'none') && (
        <SharedTextField control={control} name='costs[0].maxUses' label='Max Uses' type='number' />
      )}
    </>
  )
}

export default CostsSection
