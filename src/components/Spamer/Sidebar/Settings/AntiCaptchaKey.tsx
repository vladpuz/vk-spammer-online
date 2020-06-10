import React from 'react'
import TextField from '@material-ui/core/TextField'
import { setAntiCaptchaKey } from '../../../../redux/spamer-reducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducerType } from '../../../../redux/store'
import storage from 'store2'

function AntiCaptchaKey () {
  const antiCaptchaKey = useSelector((state: RootReducerType) => state.spamerReducer.settings.antiCaptchaKey)
  const dispatch = useDispatch()

  return (
    <TextField
      fullWidth
      label="Ключ антикапчи (anti-captcha.com)"
      type="text"
      value={antiCaptchaKey}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAntiCaptchaKey(e.currentTarget.value))
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          antiCaptchaKey: e.currentTarget.value
        })
      }}
    />
  )
}

export default AntiCaptchaKey
