import React from 'react'
import { useField } from 'formik'
import { TextField } from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField/TextField'

function MyTextField (props: TextFieldProps) {
  const [field, meta] = useField(props as any)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (props.onChange) props.onChange(e)
  }

  return (
    <TextField
      {...props}
      {...field}
      onChange={onChange}
      error={(meta.touched && !!meta.error) || props.error}
      helperText={meta.error || props.helperText}
    >
      {props.children}
    </TextField>
  )
}

export default MyTextField
