// src/components/RarityManager.tsx
import React, { useEffect, useState } from 'react'
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
import { zodResolver } from '@hookform/resolvers/zod'
import raritySchema, { RarityFormValues } from 'src/schemas/RaritySchema'
import SharedTextField from '../../../@core/components/form-components/shared-inputs/SharedTextField'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import {
  selectRarities,
  fetchRarities,
  createRarity,
  updateRarityRemote,
  deleteRarityRemote,
  reorderRarities,
  resetToDefaults
} from 'src/store/slices/raritiesSlice'
import { Alert, CircularProgress, IconButton, Stack, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

const RarityManager: React.FC = () => {
  const rarities = useAppSelector(selectRarities)
  const loading = useAppSelector(state => state.rarities.loading)
  const error = useAppSelector(state => state.rarities.error)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('#000000')
  const [editWeight, setEditWeight] = useState<number>(1)

  const { control, handleSubmit, reset } = useForm<RarityFormValues>({
    resolver: zodResolver(raritySchema),
    defaultValues: { name: '', color: '#000000', weight: 1 }
  })

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    reset()
    setEditingId(null)
  }

  // Fetch rarities when dialog opens if list empty
  useEffect(() => {
    if (open) {
      dispatch(fetchRarities())
    }
  }, [open, dispatch])

  const addRarityHandler = (data: RarityFormValues) => {
    const trimmed = data.name.trim()
    if (!trimmed) return

    // Use remote create thunk (tier is lower-case name)
    dispatch(createRarity({ tier: trimmed.toLowerCase(), color: data.color, weight: Number(data.weight) }))
    reset()
  }

  const startEdit = (id: string) => {
    const r = rarities.find(x => x.id === id)
    if (!r) return
    setEditingId(id)
    setEditName(r.name)
    setEditColor(r.color)
    setEditWeight(r.weight)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = () => {
    if (!editingId) return
    const trimmed = editName.trim()
    if (!trimmed) return
    dispatch(
      updateRarityRemote({
        id: editingId,
        changes: { tier: trimmed.toLowerCase(), color: editColor, weight: editWeight }
      })
    )
    setEditingId(null)
  }

  const remove = (id: string) => dispatch(deleteRarityRemote(id))

  const moveUp = (index: number) => {
    if (index <= 0) return
    dispatch(reorderRarities({ fromIndex: index, toIndex: index - 1 }))
  }
  const moveDown = (index: number) => {
    if (index >= rarities.length - 1) return
    dispatch(reorderRarities({ fromIndex: index, toIndex: index + 1 }))
  }

  const refresh = () => dispatch(fetchRarities())
  const resetDefaults = () => dispatch(resetToDefaults())

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Manage Rarities
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Manage Rarities</DialogTitle>
        <DialogContent>
          <Stack direction='row' spacing={1} mb={2}>
            <Button onClick={refresh} variant='outlined' disabled={loading}>
              Refresh
            </Button>
            <Button onClick={resetDefaults} variant='outlined' disabled={loading}>
              Reset Defaults
            </Button>
          </Stack>
          {loading && (
            <Box display='flex' justifyContent='center' my={2}>
              <CircularProgress size={28} />
            </Box>
          )}
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(addRarityHandler)}>
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
              {rarities.map((rarity, i) => {
                const isEditing = editingId === rarity.id

                return (
                  <ListItem
                    key={rarity.id}
                    secondaryAction={
                      <Stack direction='row' spacing={0.5}>
                        {!isEditing && (
                          <>
                            <Tooltip title='Edit'>
                              <IconButton size='small' onClick={() => startEdit(rarity.id)}>
                                <EditIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                              <IconButton size='small' color='error' onClick={() => remove(rarity.id)}>
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Move Up'>
                              <IconButton size='small' onClick={() => moveUp(i)} disabled={i === 0}>
                                <ArrowUpwardIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Move Down'>
                              <IconButton size='small' onClick={() => moveDown(i)} disabled={i === rarities.length - 1}>
                                <ArrowDownwardIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {isEditing && (
                          <>
                            <Tooltip title='Save'>
                              <IconButton size='small' color='primary' onClick={saveEdit}>
                                <SaveIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Cancel'>
                              <IconButton size='small' onClick={cancelEdit}>
                                <CloseIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    }
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: isEditing ? editColor : rarity.color,
                        borderRadius: '50%',
                        mr: 2
                      }}
                    />
                    {isEditing ? (
                      <Stack direction='row' spacing={1} alignItems='center' flexGrow={1}>
                        <SharedTextField
                          control={control}
                          name={`edit-name-${rarity.id}` as any}
                          label='Name'
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                        />
                        <input
                          type='color'
                          value={editColor}
                          onChange={e => setEditColor(e.target.value)}
                          style={{
                            width: 32,
                            height: 32,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer'
                          }}
                        />
                        <SharedTextField
                          control={control}
                          name={`edit-weight-${rarity.id}` as any}
                          label='Weight'
                          type='number'
                          value={editWeight}
                          onChange={e => setEditWeight(Number(e.target.value))}
                          sx={{ width: 90 }}
                        />
                      </Stack>
                    ) : (
                      <ListItemText primary={`${rarity.name} (w=${rarity.weight})`} secondary={rarity.color} />
                    )}
                  </ListItem>
                )
              })}
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
