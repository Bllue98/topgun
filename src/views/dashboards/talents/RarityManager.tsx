// src/components/RarityManager.tsx
import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
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

            <List>
              {rarities.map((rarity, i) => (
                <ListItem key={i}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: rarity.color,
                      borderRadius: '50%',
                      mr: 2
                    }}
                  />
                  <ListItemText primary={rarity.name} />
                </ListItem>
              ))}
            </List>

            <DialogActions>
              <Button type='submit' variant='outlined'>
                Add
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RarityManager
