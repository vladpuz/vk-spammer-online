import React from 'react'
import Title from '../../../../../common/Title/Title'
import s from './FieldAddressees.module.css'
import MyTextField from '../../../../../common/MyTextField/MyTextField'
import addresses from '../../../../../../utils/addresses'
import { useFormikContext } from 'formik'
import { useSelector } from 'react-redux'
import { rootReducerType } from '../../../../../../redux/store'

interface IProps {
  placeholder: string
}

function FieldAddressees ({ placeholder }: IProps) {
  const { values } = useFormikContext()
  const spamOnPause = useSelector((state: rootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: rootReducerType) => state.spamerReducer.spamOnRun)

  return (
    <div className={s.field}>
      <Title>Адресаты</Title>
      <MyTextField
        disabled={spamOnPause || spamOnRun}
        name="addressees"
        multiline
        fullWidth
        rows="28"
        variant="outlined"
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          addresses.setLocalValue(values.spamMode, e.currentTarget.value)
        }}
      />
    </div>
  )
}

export default FieldAddressees
