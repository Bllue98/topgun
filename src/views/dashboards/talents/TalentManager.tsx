import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material'

import { talentSchema, TalentData } from '../../../schemas/TalentSchema'

const attributes = ['Strength', 'Agility', 'Intelligence']

const TalentManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [talents, setTalents] = useState<TalentData[]>([])
  const [formData, setFormData] = useState<TalentData>({
    name: '',
    description: '',
    effect: '',
    cost: '',
    rarity: 'Comum',
    isKeyTalent: false,
    requisites: {}
  })

  const rarityColors: Record<string, string> = {
    Comum: 'gray',
    Raro: 'red',
    Lendário: 'rgba(8, 131, 255, 1)'
  }

  const handleChange = (field: keyof TalentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTalent = () => {
    const result = talentSchema.safeParse(formData)
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
    setFormData({
      name: '',
      description: '',
      effect: '',
      cost: '',
      rarity: 'Comum',
      isKeyTalent: false,
      requisites: {}
    })
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Add Talent
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>New Talent</DialogTitle>
        <DialogContent dividers>
          <TextField
            label='Talent'
            fullWidth
            margin='normal'
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
          />
          <TextField
            label='Description'
            fullWidth
            multiline
            rows={3}
            margin='normal'
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
          />
          <TextField
            label='Effect'
            fullWidth
            margin='normal'
            value={formData.effect}
            onChange={e => handleChange('effect', e.target.value)}
          />
          <TextField
            label='Cost'
            fullWidth
            margin='normal'
            value={formData.cost}
            onChange={e => handleChange('cost', e.target.value)}
          />
          <TextField
            select
            label='Rarity'
            fullWidth
            margin='normal'
            value={formData.rarity}
            onChange={e => handleChange('rarity', e.target.value)}
          >
            <MenuItem value='Comum'>Common</MenuItem>
            <MenuItem value='Raro'>Rare</MenuItem>
            <MenuItem value='Lendário'>Legendary</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Switch checked={formData.isKeyTalent} onChange={e => handleChange('isKeyTalent', e.target.checked)} />
            }
            label='Key Talent'
            sx={{ mt: 1 }}
          />

          <Typography variant='subtitle1' sx={{ mt: 2 }}>
            Attribute Requisites
          </Typography>
          {attributes.map(attr => (
            <TextField
              key={attr}
              label={`${attr} minimum`}
              type='number'
              fullWidth
              margin='normal'
              value={formData.requisites?.[attr] ?? ''}
              onChange={e => {
                const value = e.target.value ? parseInt(e.target.value) : 0
                setFormData(prev => ({
                  ...prev,
                  requisites: { ...prev.requisites, [attr]: value }
                }))
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleAddTalent}>
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

                {t.requisites && Object.keys(t.requisites).length > 0 && (
                  <Typography variant='caption' color='textSecondary'>
                    Requisites:{' '}
                    {Object.entries(t.requisites)
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
