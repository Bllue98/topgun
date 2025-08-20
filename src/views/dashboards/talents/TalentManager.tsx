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
import { TalentSchema, Talent } from '../../../schemas/BaseTalentSchema'
import EffectsSection from '../../../@core/components/form-components/talent/effect'

const TalentManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [talents, setTalents] = useState<Talent[]>([])

  const { control, handleSubmit, reset } = useForm<Talent>({
    defaultValues: {
      name: '',
      description: '',
      isKeyTalent: false,
      tags: [],
      category: '',
      requirements: [],
      costs: [],
      rarity: {
        tier: 'common',
        weight: 1,
        color: undefined
      },
      effects: [],
      cooldown: 0,
      rank: 1,
      maxRank: 1

      // Add any other required fields from BaseAttributeSchema if needed
    }
  })

  const rarityColors: Record<string, string> = {
    common: 'gray',
    rare: 'red',
    legendary: 'rgba(8, 131, 255, 1)'
  }

  const onSubmit = (data: any) => {
    const result = TalentSchema.safeParse(data)
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
          <SharedTextField control={control} name='cost' label='Cost' required />

          {/* Effects */}
          <Typography variant='subtitle1' sx={{ mt: 2 }}>
            Effects
          </Typography>
          <EffectsSection control={control} />

          {/* Rarity */}
          <SharedTextField control={control} name='rarity.tier' label='Rarity' select>
            <MenuItem value='common'>Common</MenuItem>
            <MenuItem value='rare'>Rare</MenuItem>
            <MenuItem value='legendary'>Legendary</MenuItem>
          </SharedTextField>

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
                    <span style={{ color: rarityColors[t.rarity.tier] }}>{t.name}</span>
                    {t.isKeyTalent && <span style={{ color: 'rgba(212, 212, 212, 1)' }}> - Chave</span>}
                  </Typography>
                }
                subheader={
                  <>
                    <Typography component='span' sx={{ color: 'rgba(160, 160, 160, 1)' }}>
                      {t.rarity.tier}
                    </Typography>
                  </>
                }
              />
              <CardContent>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {t.description}
                </Typography>
                <Typography variant='subtitle2' color='primary'>
                  {t.effects[0]?.kind === 'stat-mod' ? t.effects[0].stat : t.effects[0]?.kind}
                </Typography>
                {t.requirements && Object.entries(t.requirements).some(([, val]) => val !== undefined) && (
                  <Typography variant='caption' color='textSecondary'>
                    Requisites:{' '}
                    {Object.entries(t.requirements)
                      .filter(([, val]) => val !== undefined)
                      .map(([attr, val]) => `${attr} ≥ ${val}`)
                      .join(', ')}
                  </Typography>
                )}
                <Typography component='span' sx={{ color: 'rgb(228, 230, 244)', fontWeight: 'bold' }}>
                  {t.costs[0]?.kind === 'resource'
                    ? t.costs[0].amount
                    : t.costs[0]?.kind === 'cooldown'
                    ? `${t.costs[0].turns} turns cooldown`
                    : t.costs[0]?.kind ?? '—'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default TalentManager
