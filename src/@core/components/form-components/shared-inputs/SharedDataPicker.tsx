import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import { FormControl } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

type SharedDatePickerProps = {
  control: any
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  marginBottom?: number
}

const SharedDatePicker: React.FC<SharedDatePickerProps> = ({
  control,
  name,
  label,
  required = false,
  disabled = false,
  marginBottom = 0
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FormControl fullWidth sx={{ marginBottom }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field, fieldState }) => (
            <DatePicker
              value={field.value ? dayjs(field.value, 'YYYY-MM-DD', true) : null}
              onChange={date => {
                if (date && date.isValid()) {
                  field.onChange(date.format('YYYY-MM-DD'))
                } else {
                  field.onChange('')
                }
              }}
              disabled={disabled}
              open={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  label,
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message,
                  onClick: () => setIsOpen(true)
                }
              }}
            />
          )}
        />
      </LocalizationProvider>
    </FormControl>
  )
}

export default SharedDatePicker
