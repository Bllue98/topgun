import React, { useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
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
  CardMedia,
  Collapse,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/material/styles'
import { useForm } from 'react-hook-form'

interface CardData {
  title: string
  date: string
  shortDescription: string
  longDescription: string
  image?: string
}

const ExpandMore = styled(IconButton)<{ expand: boolean }>(({ theme, expand }) => ({
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

const RelatoryDialog: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [cards, setCards] = useState<CardData[]>([])
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({})
  const [showLongDescription, setShowLongDescription] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CardData>({
    defaultValues: {
      title: '',
      date: '',
      shortDescription: '',
      longDescription: '',
      image: ''
    }
  })

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    reset()
    setSelectedFileName('')
    setShowLongDescription(false)
  }

  const onSubmit = (data: CardData) => {
    setCards(prev => [...prev, data])
    setExpanded(prev => ({ ...prev, [cards?.length]: false }))
    handleClose()
  }

  const handleExpandClick = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <>
      <Button variant='contained' onClick={handleOpen}>
        Add Relatory
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>New Relatory</DialogTitle>
        <DialogContent dividers>
          <TextField
            {...register('title', { required: 'O título é obrigatório' })}
            label='Title'
            fullWidth
            margin='normal'
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            {...register('date', { required: 'A data é obrigatória' })}
            label='Date'
            type='date'
            fullWidth
            margin='normal'
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date?.message}
          />

          <TextField
            {...register('shortDescription', { required: 'A descrição curta é obrigatória' })}
            label='Short Description'
            fullWidth
            margin='normal'
            error={!!errors.shortDescription}
            helperText={errors.shortDescription?.message}
          />

          <input
            accept='image/*'
            id='upload-image'
            type='file'
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                const imageUrl = URL.createObjectURL(file)
                setValue('image', imageUrl)
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

          {watch('image') && (
            <CardMedia
              component='img'
              src={watch('image')}
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
            <TextField
              {...register('longDescription')}
              label='Long Description'
              fullWidth
              multiline
              rows={4}
              margin='normal'
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button variant='contained' onClick={handleSubmit(onSubmit)}>
            Add
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

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

export default RelatoryDialog
