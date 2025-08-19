import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import SharedTextField from '../../../@core/components/form-components/shared-inputs/SharedTextField'
import { talentSchema, TalentData } from '../../../schemas/TalentSchema'

const attributes = ['Strength', 'Agility', 'Intelligence']

const TalentManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [talents, setTalents] = useState<TalentData[]>([])

  const { control, handleSubmit, reset, setValue } = useForm<TalentData>({
    defaultValues: {
      name: '',
      description: '',
      effect: '',
      cost: '',
      rarity: 'Comum',
      isKeyTalent: false,
      requisites: {}
    }
  })

  const rarityColors: Record<string, string> = {
    Comum: 'gray',
    Raro: 'red',
    Lendário: 'rgba(8, 131, 255, 1)'
  }

  const onSubmit = (data: TalentData) => {
    const result = talentSchema.safeParse(data)
    if (!result.success) {
      console.log('Validation errors:', result.error.format())

      return
    }

    setTalents(prev => [...prev, result.data])
    handleClose()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Add Talent
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>New Talent</DialogTitle>
        <DialogContent dividers>
          <SharedTextField control={control} name='name' label='Talent' required />
          <SharedTextField control={control} name='description' label='Description' multiline rows={3} required />
          <SharedTextField control={control} name='effect' label='Effect' required />
          <SharedTextField control={control} name='cost' label='Cost' required />

          {/* Rarity */}
          <Controller
            name='rarity'
            control={control}
            render={({ field }) => (
              <SharedTextField {...field} control={control} name='rarity' label='Rarity' select>
                <MenuItem value='Comum'>Common</MenuItem>
                <MenuItem value='Raro'>Rare</MenuItem>
                <MenuItem value='Lendário'>Legendary</MenuItem>
              </SharedTextField>
            )}
          />

          {/* Key Talent */}
          <Controller
            name='isKeyTalent'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                label='Key Talent'
                sx={{ mt: 1 }}
              />
            )}
          />

          <Typography variant='subtitle1' sx={{ mt: 2 }}>
            Attribute Requisites
          </Typography>
          {attributes.map(attr => (
            <SharedTextField
              key={attr}
              control={control}
              name={`requisites.${attr}`}
              label={`${attr} minimum`}
              type='number'
              onChange={e => {
                const raw = e.target.value
                const value = raw === '' ? undefined : parseInt(raw, 10)
                setValue(`requisites.${attr}` as any, value)
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleSubmit(onSubmit)}>
            Adicionar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {talents.map((t, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card>
              <CardHeader
                title={
                  <Typography variant='h6'>
                    <span style={{ color: rarityColors[t.rarity] }}>{t.name}</span>
                    {t.isKeyTalent && <span style={{ color: 'rgba(212, 212, 212, 1)' }}> - Chave</span>}
                  </Typography>
                }
                subheader={
                  <>
                    <Typography component='span' sx={{ color: 'rgb(228, 230, 244)', fontWeight: 'bold' }}>
                      {t.cost}
                    </Typography>
                    {' | '}
                    <Typography component='span' sx={{ color: 'rgba(160, 160, 160, 1)' }}>
                      {t.rarity}
                    </Typography>
                  </>
                }
              />
              <CardContent>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {t.description}
                </Typography>
                <Typography variant='subtitle2' color='primary'>
                  {t.effect}
                </Typography>
                {t.requisites && Object.entries(t.requisites).some(([, val]) => val !== undefined) && (
                  <Typography variant='caption' color='textSecondary'>
                    Requisites:{' '}
                    {Object.entries(t.requisites)
                      .filter(([, val]) => val !== undefined)
                      .map(([attr, val]) => `${attr} ≥ ${val}`)
                      .join(', ')}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default TalentManager
