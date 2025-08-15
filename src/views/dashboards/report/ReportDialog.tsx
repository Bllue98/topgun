import React, { useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
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
  CardMedia,
  Collapse,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/material/styles'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSchema, ReportData } from '../../../schemas/ReportSchema'
import SharedTextField from 'src/@core/components/form-components/shared-inputs/SharedTextField'
import SharedDatePicker from 'src/@core/components/form-components/shared-inputs/SharedDataPicker'

const ExpandMore = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'expand'
})<{ expand: boolean }>(({ theme, expand }) => ({
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

const ReportDialog: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [cards, setCards] = useState<ReportData[]>([])
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({})
  const [showLongDescription, setShowLongDescription] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')

  const methods = useForm<ReportData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      date: '',
      shortDescription: '',
      longDescription: ''
    }
  })

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = methods

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    reset()
    setSelectedFileName('')
    setShowLongDescription(false)
  }

  const onSubmit = (data: ReportData) => {
    setCards(prev => {
      const next = [...prev, data]
      setExpanded(exp => ({ ...exp, [next?.length - 1]: false }))

      return next
    })
    handleClose()
  }

  const handleExpandClick = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const imageUrl = watch('image')

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Add Report
      </Button>

      <FormProvider {...methods}>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
          <DialogTitle>New Report</DialogTitle>
          <DialogContent dividers>
            <SharedTextField control={methods.control} name='title' label='Title' required={true} />
            <SharedDatePicker control={methods.control} name='date' label='Date' required={true} />
            <SharedTextField
              control={methods.control}
              name='shortDescription'
              label='Short Description'
              required={true}
            />
            <input
              accept='image/*'
              id='upload-image'
              type='file'
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => {
                    setValue('image', reader.result as string, { shouldDirty: true, shouldValidate: true })
                  }
                  reader.readAsDataURL(file)
                  setSelectedFileName(file.name)
                }
              }}
            />
            <label htmlFor='upload-image'>
              <Button variant='outlined' component='span' startIcon={<UploadFileIcon />} sx={{ mt: 2 }} fullWidth>
                Selecionar Imagem
              </Button>
            </label>

            {selectedFileName && (
              <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
                Imagem selecionada: {selectedFileName}
              </Typography>
            )}

            {errors.image?.message && (
              <Typography variant='caption' color='error' sx={{ mt: 1, display: 'block' }}>
                {errors.image.message}
              </Typography>
            )}

            {imageUrl && (
              <CardMedia
                component='img'
                src={imageUrl}
                alt='Pré-visualização'
                sx={{
                  width: 'auto',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: 200,
                  objectFit: 'contain',
                  mt: 1
                }}
              />
            )}

            {!showLongDescription && (
              <Button variant='text' onClick={() => setShowLongDescription(true)} sx={{ mt: 2 }}>
                Adicionar descrição detalhada
              </Button>
            )}
            {showLongDescription && (
              <SharedTextField control={methods.control} name='longDescription' label='Long Description' />
            )}
          </DialogContent>

          <DialogActions>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>
              Add
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </FormProvider>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Card Fixo' subheader='2025-07-19' />
            <CardContent>
              <Typography>Descrição fixa: este resumo sempre aparece.</Typography>
            </CardContent>
          </Card>
        </Grid>

        {cards.map((c, i) => (
          <Grid item xs={12} key={i}>
            <Card>
              <CardHeader
                title={c.title}
                subheader={c.date}
                action={
                  <ExpandMore
                    expand={expanded[i] || false}
                    onClick={() => handleExpandClick(i)}
                    aria-expanded={expanded[i] || false}
                    aria-label='show more'
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                }
              />
              <CardContent>
                <Typography>{c.shortDescription}</Typography>
              </CardContent>
              <Collapse in={expanded[i]} timeout='auto' unmountOnExit>
                {c.image && (
                  <CardMedia
                    component='img'
                    src={c.image}
                    alt={`Imagem de ${c.title}`}
                    sx={{
                      width: 'auto',
                      maxWidth: '100%',
                      paddingLeft: 6,
                      height: 'auto',
                      maxHeight: 300,
                      objectFit: 'contain',
                      mt: 1
                    }}
                  />
                )}
                <CardContent sx={{ mt: 1 }}>
                  <Typography>{c.longDescription}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default ReportDialog
