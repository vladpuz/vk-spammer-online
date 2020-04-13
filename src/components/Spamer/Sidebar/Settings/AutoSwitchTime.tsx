import React from 'react'
import { InputAdornment } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { setAutoSwitchTime } from '../../../../redux/spamer-reducer'
import { RootReducerType } from '../../../../redux/store'
import bs from '../../../../utils/BrowserStorage'

function AutoSwitchTime () {
  const autoSwitchTime = useSelector((state: RootReducerType) => state.spamerReducer.settings.autoSwitchTime)
  const dispatch = useDispatch()

  return (
    <TextField
      fullWidth
      label="Время автосмены аккаунтов"
      InputProps={{
        startAdornment: <InputAdornment position="start">секунды:</InputAdornment>,
      }}
      type="number"
      inputProps={{ min: '0' }}
      placeholder="никогда"
      value={autoSwitchTime || ''}
      helperText="Если указать ноль - спамить будут все активные аккаунты одновременно"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAutoSwitchTime(+e.currentTarget.value))
        bs.local.set('fields.autoSwitchTime', e.currentTarget.value)
      }}
    />
  )
}

export default AutoSwitchTime
