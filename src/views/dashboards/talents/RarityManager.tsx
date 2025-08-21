// src/components/RarityManager.tsx
import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import SharedTextField from '../../../@core/components/form-components/shared-inputs/SharedTextField'

interface Rarity {
  name: string
  color: string
  weight: number
}

interface RarityFormValues {
  name: string
  color: string
  weight: number
}

const RarityManager: React.FC = () => {
  const [rarities, setRarities] = useState<Rarity[]>([
    { name: 'Common', color: '#888888', weight: 1 },
    { name: 'Epic', color: '#ff0000', weight: 2 },
    { name: 'Legendary', color: '#0000ff', weight: 3 }
  ])
  const [open, setOpen] = useState(false)

  const { control, handleSubmit, reset } = useForm<RarityFormValues>({
    defaultValues: { name: '', color: '#000000', weight: 1 }
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const addRarity = (data: RarityFormValues) => {
    const trimmed = data.name.trim()
    if (trimmed && !rarities.some(r => r.name === trimmed)) {
      setRarities([...rarities, data].sort((a, b) => b.weight - a.weight))
      reset()
    }
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Manage Rarities
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Manage Rarities</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(addRarity)}>
            <SharedTextField control={control} name='name' label='New Rarity' required />

            <Controller
              name='color'
              control={control}
              render={({ field }) => (
                <Box display='flex' alignItems='center' mb={2}>
                  <input
                    type='color'
                    {...field}
                    style={{
                      border: 'none',
                      width: 36,
                      height: 36,
                      padding: 0,
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  />
                  <SharedTextField
                    {...field}
                    control={control}
                    label='Color'
                    variant='standard'
                    sx={{ ml: 2, width: '100%' }}
                  />
                </Box>
              )}
            />
            <SharedTextField control={control} name='weight' label='Weight' type='number' required />

            <DialogActions>
              <Button type='submit' variant='outlined'>
                Add
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Show all rarities as cards below */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {rarities.map((rarity, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: rarity.color,
                    borderRadius: '50%',
                    mr: 2,
                    border: '1px solid #ccc'
                  }}
                />
                <Box>
                  <Typography variant='h6'>{rarity.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Color: {rarity.color}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Weight: {rarity.weight}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default RarityManager
