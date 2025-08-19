// src/components/RarityManager.tsx
import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
  InputAdornment
} from '@mui/material'

interface Rarity {
  name: string
  color: string
  weight: number
}

const RarityManager: React.FC = () => {
  const [rarities, setRarities] = useState<Rarity[]>([
    { name: 'Common', color: '#888888', weight: 1 },
    { name: 'Epic', color: '#ff0000', weight: 3 },
    { name: 'Legendary', color: '#0000ff', weight: 4 }
  ])
  const [open, setOpen] = useState(false)
  const [newRarity, setNewRarity] = useState('')
  const [color, setColor] = useState('#000000')
  const [weight, setWeight] = useState(1)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const addRarity = () => {
    const trimmed = newRarity.trim()
    if (trimmed && !rarities.some(r => r.name === trimmed)) {
      setRarities([...rarities, { name: trimmed, color, weight }].sort((a, b) => b.weight - a.weight))
      setNewRarity('')
      setColor('#000000')
      setWeight(1)
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
          <TextField
            label='New Rarity'
            fullWidth
            value={newRarity}
            onChange={e => setNewRarity(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addRarity()
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label='Color'
            fullWidth
            value={color}
            onChange={e => setColor(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: color,
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label='Weight'
            type='number'
            fullWidth
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <List>
            {rarities
              .sort((a, b) => b.weight - a.weight)
              .map((rarity, i) => (
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
                  {/* Only show name, not weight */}
                  <ListItemText primary={rarity.name} />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={addRarity} variant='outlined'>
            Add
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RarityManager
