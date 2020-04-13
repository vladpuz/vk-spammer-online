import React from 'react'
import { useField } from 'formik'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'

function MyCheckbox (props: CheckboxProps) {
  const [field] = useField(props as any)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (props.onChange) props.onChange(e, e.currentTarget.checked)
  }

  return (
    <Checkbox
      {...props}
      {...field}
      onChange={onChange}
      checked={field.value}
    />
  )
}

export default MyCheckbox
