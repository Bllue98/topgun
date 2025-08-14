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
import { z } from 'zod'

interface TalentData {
  name: string
  description: string
  effect: string // Buff ou Dano
  cost: string
  rarity: string // Comum, Raro, Lendário
  isKeyTalent: boolean
}

const talentSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  effect: z.string().min(1, 'O efeito é obrigatório').default('Nenhum'),
  cost: z.string().optional().default('Nenhum'), // opcional
  rarity: z.enum(['Comum', 'Raro', 'Lendário']).default('Comum'), // só pode ser um dos três
  isKeyTalent: z.boolean().default(false) // false ou true
})

const TalentManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [talents, setTalents] = useState<TalentData[]>([])
  const [formData, setFormData] = useState<TalentData>({
    name: '',
    description: '',
    effect: '',
    cost: '',
    rarity: 'Comum',
    isKeyTalent: false
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      name: '',
      description: '',
      effect: '',
      cost: '',
      rarity: 'Comum',
      isKeyTalent: false
    })
  }

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
      const formattedErrors = z.treeifyError(result.error)
      console.log('Erros de validação:', formattedErrors)

      return
    }

    setTalents(prev => [...prev, result.data])
    handleClose()
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Adicionar Talento
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Novo Talento</DialogTitle>
        <DialogContent dividers>
          <TextField
            label='Talento'
            fullWidth
            margin='normal'
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
          />
          <TextField
            label='Descrição'
            fullWidth
            multiline
            rows={3}
            margin='normal'
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
          />
          <TextField
            label='Efeito'
            fullWidth
            margin='normal'
            value={formData.effect}
            onChange={e => handleChange('effect', e.target.value)}
          />
          <TextField
            label='Custo'
            fullWidth
            margin='normal'
            value={formData.cost}
            onChange={e => handleChange('cost', e.target.value)}
          />
          <TextField
            select
            label='Raridade'
            fullWidth
            margin='normal'
            value={formData.rarity}
            onChange={e => handleChange('rarity', e.target.value)}
          >
            <MenuItem value='Comum'>Comum</MenuItem>
            <MenuItem value='Raro'>Raro</MenuItem>
            <MenuItem value='Lendário'>Lendário</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Switch checked={formData.isKeyTalent} onChange={e => handleChange('isKeyTalent', e.target.checked)} />
            }
            label='Talento Chave'
            sx={{ mt: 1 }}
          />
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
                    <Typography component='span' sx={{ color: '#3f85e0ff', fontWeight: 'bold' }}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default TalentManager
