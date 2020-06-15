import React from 'react'
import { InputAdornment } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { RootReducerType } from '../../../../redux/store'
import storage from 'store2'
import MyTextField from '../../../common/MyTextField'

function AutoSwitchTime () {
  const spamOnPause = useSelector((state: RootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: RootReducerType) => state.spamerReducer.spamOnRun)

  return (
    <MyTextField
      fullWidth
      disabled={spamOnPause || spamOnRun}
      label="Время автосмены аккаунтов"
      InputProps={{
        startAdornment: <InputAdornment position="start">секунды:</InputAdornment>
      }}
      type="number"
      inputProps={{ min: '0' }}
      placeholder="ноль"
      helperText="Если указать ноль - спамить будут все активные аккаунты одновременно"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          autoSwitchTime: e.currentTarget.value,
          autoSwitchRemaining: e.currentTarget.value
        })
      }}
      name="autoSwitchTime"
    />
  )
}

export default AutoSwitchTime
