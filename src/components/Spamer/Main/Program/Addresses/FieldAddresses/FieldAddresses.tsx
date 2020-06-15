import React from 'react'
import Title from '../../../../../common/Title/Title'
import s from './FieldAddresses.module.css'
import MyTextField from '../../../../../common/MyTextField'
import { useSelector } from 'react-redux'
import { RootReducerType } from '../../../../../../redux/store'
import storage from 'store2'

interface IProps {
  placeholder: string
}

function FieldAddresses ({ placeholder }: IProps) {
  const spamOnPause = useSelector((state: RootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: RootReducerType) => state.spamerReducer.spamOnRun)

  return (
    <div className={s.field}>
      <Title>Адресаты</Title>
      <MyTextField
        disabled={spamOnPause || spamOnRun}
        name="addresses"
        multiline
        fullWidth
        rows="28"
        variant="outlined"
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const fields = storage.local.get('fields')
          storage.local.set('fields', {
            ...fields,
            addresses: e.currentTarget.value
          })
        }}
      />
    </div>
  )
}

export default FieldAddresses
