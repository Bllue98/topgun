import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent
} from '@mui/material'
import { useForm } from 'react-hook-form'
import EffectsSection from 'src/@core/components/form-components/talent/effect'

interface EffectManagerForm {
  effects: any[]
}

const EffectManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [effectsList, setEffectsList] = useState<any[]>([])

  const { control, handleSubmit, reset } = useForm<EffectManagerForm>({
    defaultValues: { effects: [] }
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const onSubmit = (data: EffectManagerForm) => {
    setEffectsList(prev => [...prev, ...data.effects])
    handleClose()
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Manage Effects
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Manage Effects</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <EffectsSection control={control} />
            <DialogActions>
              <Button type='submit' variant='outlined'>
                Add
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {effectsList.map((effect, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card>
              <CardHeader title={`Effect #${i + 1} (${effect.kind})`} />
              <CardContent>
                <Typography variant='body2'>{JSON.stringify(effect, null, 2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default EffectManager
