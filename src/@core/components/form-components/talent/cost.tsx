import React from 'react'
import { useWatch, Controller } from 'react-hook-form'
import { MenuItem } from '@mui/material'
import SharedTextField from '../shared-inputs/SharedTextField'

interface Props {
  control: any
}

const CostsSection: React.FC<Props> = ({ control }) => {
  const cost = useWatch({ control, name: 'costs[0]' }) || { resource: 'none', kind: 'resource' }
  const resource = cost.resource ?? 'none'

  return (
    <>
      {/* Resource Selection */}
      {/* Hidden kind field to ensure kind is always 'resource' */}
      <Controller
        name='costs.0.kind'
        control={control}
        defaultValue='resource'
        render={({ field }) => <input type='hidden' {...field} value='resource' />}
      />
      <SharedTextField control={control} name='costs[0].resource' label='Cost' select>
        <MenuItem value='ether'>Ether</MenuItem>
        <MenuItem value='stamina'>Stamina</MenuItem>
        <MenuItem value='none'>None</MenuItem>
      </SharedTextField>

      {/* Conditional fields */}
      {(resource === 'ether' || resource === 'stamina') && (
        <Controller
          name={`costs.0.amount`}
          control={control}
          render={({ field }) => (
            <SharedTextField
              {...field}
              control={control}
              label='Amount'
              type='number'
              onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
            />
          )}
        />
      )}

      {(resource === 'ether' || resource === 'stamina' || resource === 'none') && (
        <Controller
          name='costs.0.maxUses'
          control={control}
          render={({ field }) => (
            <SharedTextField
              {...field}
              control={control}
              label='Max Uses'
              type='number'
              onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
            />
          )}
        />
      )}
    </>
  )
}

export default CostsSection
