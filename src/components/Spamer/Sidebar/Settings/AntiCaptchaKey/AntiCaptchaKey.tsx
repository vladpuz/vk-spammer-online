import React from 'react'
import TextField from '@material-ui/core/TextField'
import { setAntiCaptchaKey } from '../../../../../redux/spamer-reducer'
import { useDispatch, useSelector } from 'react-redux'
import { rootReducerType } from '../../../../../redux/store'
import bs from '../../../../../utils/BrowserStorage'

function AntiCaptchaKey () {
  const antiCaptchaKey = useSelector((state: rootReducerType) => state.spamerReducer.settings.antiCaptchaKey)
  const dispatch = useDispatch()

  return (
    <TextField
      fullWidth
      label="Ключ антикапчи (anti-captcha.com)"
      type="text"
      value={antiCaptchaKey}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAntiCaptchaKey(e.currentTarget.value))
        bs.local.set('fields.antiCaptchaKey', e.currentTarget.value)
      }}
    />
  )
}

export default AntiCaptchaKey
