import React from 'react'
import storage from 'store2'
import MyTextField from '../../../common/MyTextField'

function AntiCaptchaKey () {
  return (
    <MyTextField
      fullWidth
      label="Ключ антикапчи (anti-captcha.com)"
      type="text"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          antiCaptchaKey: e.currentTarget.value
        })
      }}
      name="antiCaptchaKey"
    />
  )
}

export default AntiCaptchaKey
