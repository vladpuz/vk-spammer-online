import React from 'react'
import { useField } from 'formik'
import { RadioGroup } from '@material-ui/core'
import { RadioGroupProps } from '@material-ui/core/RadioGroup/RadioGroup'

function MyRadioGroup (props: RadioGroupProps) {
  const [field] = useField(props as any)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (props.onChange) props.onChange(e, e.currentTarget.value)
  }

  return (
    <RadioGroup
      {...props}
      {...field}
      value={field.value}
      onChange={onChange}
    >
      {props.children}
    </RadioGroup>
  )
}

export default MyRadioGroup
