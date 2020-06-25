import React from 'react'
import { InputAdornment } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../../../../redux/store'
import storage from 'store2'
import MyTextField from '../../../common/MyTextField'
import { setAutoSwitchRemaining } from '../../../../redux/ducks/spamer/action-creators'

function AutoSwitchTime () {
  const spamOnPause = useSelector((state: StateType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: StateType) => state.spamerReducer.spamOnRun)
  const dispatch = useDispatch()

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
        dispatch(setAutoSwitchRemaining(+e.currentTarget.value))
      }}
      name="autoSwitchTime"
    />
  )
}

export default AutoSwitchTime
