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
        const durationType = effects[index]?.duration?.type

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
                    <MenuItem value='remove'>Remove</MenuItem>
                  </SharedTextField>

                  {/* value can now be a number OR dice string */}
                  <Controller
                    name={`effects.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <SharedTextField
                        {...field}
                        control={control}
                        label='Value (number or dice, ex: 5 or 1d8+2)'
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value)}
                      />
                    )}
                  />
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

              {/* Duration — applies to all kinds */}
              <SharedTextField control={control} name={`effects.${index}.duration.type`} label='Duration' select>
                <MenuItem value='instant'>Instant</MenuItem>
                <MenuItem value='rounds'>Rounds</MenuItem>
                <MenuItem value='permanent'>Permanent</MenuItem>
              </SharedTextField>

              {durationType === 'rounds' && (
                <SharedTextField
                  control={control}
                  name={`effects.${index}.duration.value`}
                  label='Number of Rounds'
                  type='number'
                />
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
