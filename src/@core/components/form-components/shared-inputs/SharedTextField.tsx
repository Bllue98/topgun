import React from 'react'
import { Controller } from 'react-hook-form'
import { TextField, TextFieldProps } from '@mui/material'

type SharedTextFieldProps = TextFieldProps & {
  control: any
  name: string
  required?: boolean | string
}

const SharedTextField: React.FC<SharedTextFieldProps> = ({ control, name, label, required, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          fullWidth
          margin='normal'
          {...rest}
        />
      )}
    />
  )
}

export default SharedTextField
