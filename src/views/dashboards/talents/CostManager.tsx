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
import CostsSection from 'src/@core/components/form-components/talent/cost'

interface CostManagerForm {
  costs: any[]
}

const CostManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [costsList, setCostsList] = useState<any[]>([])

  const { control, handleSubmit, reset } = useForm<CostManagerForm>({
    defaultValues: { costs: [] }
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const onSubmit = (data: CostManagerForm) => {
    setCostsList(prev => [...prev, ...data.costs])
    handleClose()
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Manage Costs
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Manage Costs</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CostsSection control={control} />
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
        {costsList.map((cost, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card>
              <CardHeader title={`Cost #${i + 1} (${cost.resource})`} />
              <CardContent>
                <Typography variant='body2'>{JSON.stringify(cost, null, 2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default CostManager
