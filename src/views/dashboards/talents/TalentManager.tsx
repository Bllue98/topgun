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
import EffectsSection from '../../../@core/components/form-components/talent/effect'
import CostsSection from '../../../@core/components/form-components/talent/cost'
import { TalentSchema, Talent } from '../../../schemas/BaseTalentSchema'

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
    }
  })

  const rarityColors: Record<string, string> = {
    common: 'gray',
    rare: 'red',
    legendary: 'rgba(8, 131, 255, 1)'
  }

  const onSubmit = (data: Talent) => {
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

          {/* Costs */}

          <CostsSection control={control} />

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
            Add
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
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
                    {t.isKeyTalent && <span style={{ color: 'rgba(212, 212, 212, 1)' }}> - Key</span>}
                  </Typography>
                }
                subheader={
                  <Typography component='span' sx={{ color: 'rgba(160, 160, 160, 1)' }}>
                    {t.rarity.tier}
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {t.description}
                </Typography>

                {t.effects.length > 0 && (
                  <Typography variant='subtitle2' color='primary'>
                    {t.effects[0].kind === 'stat-mod' ? t.effects[0].stat : t.effects[0].kind}
                  </Typography>
                )}

                {t.costs.length > 0 && (
                  <>
                    <Typography variant='subtitle2' sx={{ mt: 1 }}>
                      Costs:
                    </Typography>
                    {t.costs.map((cost, idx) => (
                      <Typography key={idx} variant='body2'>
                        {cost.resource}:{' '}
                        {typeof cost.amount === 'number' ? cost.amount : cost.amount ? Number(cost.amount) : 'N/A'}{' '}
                        {cost.maxUses
                          ? `(Max: ${typeof cost.maxUses === 'number' ? cost.maxUses : Number(cost.maxUses)})`
                          : ''}
                      </Typography>
                    ))}
                  </>
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
