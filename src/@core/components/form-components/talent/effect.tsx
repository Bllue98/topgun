import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, MenuItem, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import SharedTextField from '../shared-inputs/SharedTextField'

interface Props {
  control: any
}

const EffectsSection: React.FC<Props> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'effects'
  })

  // ✅ watch the whole effects array once
  const effects = useWatch({ control, name: 'effects' }) || []

  return (
    <>
      {fields.map((field, index) => {
        const kind = effects[index]?.kind

        return (
          <Accordion key={field.id} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Effect {index + 1} — {kind ?? 'select type'}
              </Typography>
              <IconButton onClick={() => remove(index)} size='small' sx={{ ml: 2 }}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              {/* Kind */}
              <Controller
                name={`effects.${index}.kind`}
                control={control}
                render={({ field }) => (
                  <SharedTextField {...field} control={control} name={`effects.${index}.kind`} label='Type' select>
                    <MenuItem value='stat-mod'>Stat Modifier</MenuItem>
                    <MenuItem value='damage'>Damage</MenuItem>
                    <MenuItem value='heal'>Heal</MenuItem>
                    <MenuItem value='tag'>Tag</MenuItem>
                  </SharedTextField>
                )}
              />

              {/* Conditional fields */}
              {kind === 'stat-mod' && (
                <>
                  <SharedTextField control={control} name={`effects.${index}.target`} label='Target' select>
                    <MenuItem value='self'>Self</MenuItem>
                    <MenuItem value='ally'>Ally</MenuItem>
                    <MenuItem value='enemy'>Enemy</MenuItem>
                  </SharedTextField>

                  <SharedTextField control={control} name={`effects.${index}.stat`} label='Stat' />

                  <SharedTextField control={control} name={`effects.${index}.op`} label='Operation' select>
                    <MenuItem value='add'>Add</MenuItem>
                    <MenuItem value='mul'>Multiply</MenuItem>
                    <MenuItem value='set'>Set</MenuItem>
                  </SharedTextField>

                  {/* value can now be a number OR dice string */}
                  <SharedTextField control={control} name={`effects.${index}.value`} label='Value (e.g. 5 or 2d6+3)' />
                </>
              )}

              {kind === 'damage' && (
                <>
                  <SharedTextField control={control} name={`effects.${index}.target`} label='Target' select>
                    <MenuItem value='enemy'>Enemy</MenuItem>
                    <MenuItem value='area'>Area</MenuItem>
                  </SharedTextField>

                  <SharedTextField control={control} name={`effects.${index}.damageType`} label='Damage Type' />

                  {/* amount can now be a number OR dice string */}
                  <SharedTextField
                    control={control}
                    name={`effects.${index}.amount`}
                    label='Amount (e.g. 10 or 1d8+2)'
                  />
                </>
              )}

              {kind === 'heal' && (
                <>
                  <SharedTextField control={control} name={`effects.${index}.target`} label='Target' select>
                    <MenuItem value='self'>Self</MenuItem>
                    <MenuItem value='ally'>Ally</MenuItem>
                    <MenuItem value='area'>Area</MenuItem>
                  </SharedTextField>

                  {/* heal amount can now be a number OR dice string */}
                  <SharedTextField control={control} name={`effects.${index}.amount`} label='Amount' />
                </>
              )}

              {kind === 'tag' && (
                <>
                  <SharedTextField control={control} name={`effects.${index}.action`} label='Action' select>
                    <MenuItem value='add'>Add</MenuItem>
                    <MenuItem value='remove'>Remove</MenuItem>
                  </SharedTextField>
                  <SharedTextField control={control} name={`effects.${index}.tag`} label='Tag' />
                </>
              )}
            </AccordionDetails>
          </Accordion>
        )
      })}

      <Button
        variant='outlined'
        onClick={() =>
          append({
            kind: 'stat-mod',
            target: 'enemy',
            stat: '',
            op: 'add',
            value: '',
            duration: { type: 'instant' }
          })
        }
        sx={{ mt: 2 }}
      >
        Add Effect
      </Button>
    </>
  )
}

export default EffectsSection
