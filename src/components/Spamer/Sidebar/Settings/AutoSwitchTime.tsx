import React from 'react'
import { InputAdornment } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { setAutoSwitchRemaining, setAutoSwitchTime } from '../../../../redux/spamer-reducer'
import { RootReducerType } from '../../../../redux/store'
import storage from 'store2'

function AutoSwitchTime () {
  const autoSwitchTime = useSelector((state: RootReducerType) => state.spamerReducer.settings.autoSwitchTime)
  const spamOnPause = useSelector((state: RootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: RootReducerType) => state.spamerReducer.spamOnRun)
  const dispatch = useDispatch()

  return (
    <TextField
      fullWidth
      disabled={spamOnPause || spamOnRun}
      label="Время автосмены аккаунтов"
      InputProps={{
        startAdornment: <InputAdornment position="start">секунды:</InputAdornment>
      }}
      type="number"
      inputProps={{ min: '0' }}
      placeholder="ноль"
      value={autoSwitchTime || ''}
      helperText="Если указать ноль - спамить будут все активные аккаунты одновременно"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAutoSwitchTime(+e.currentTarget.value))
        dispatch(setAutoSwitchRemaining(+e.currentTarget.value))

        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          autoSwitchTime: e.currentTarget.value,
          autoSwitchRemaining: e.currentTarget.value
        })
      }}
    />
  )
}

export default AutoSwitchTime
