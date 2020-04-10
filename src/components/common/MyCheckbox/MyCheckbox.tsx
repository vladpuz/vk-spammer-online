import React from 'react'
import { useField } from 'formik'
import Checkbox from '@material-ui/core/Checkbox'

function MyCheckbox (props: any) {
  const [field, meta] = useField(props)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (props.onChange) props.onChange(e)
  }

  return (
    <Checkbox
      {...props}
      {...field}
      onChange={onChange}
      error={(meta.touched && !!meta.error) || props.error}
      checked={field.value}
    />
  )
}

export default MyCheckbox
