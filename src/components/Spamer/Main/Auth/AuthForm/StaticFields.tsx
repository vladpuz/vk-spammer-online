import React from 'react'
import MyTextField from '../../../../common/MyTextField'
import { MenuItem } from '@material-ui/core'

function StaticFields () {
  return (
    <>
      <MyTextField fullWidth select name="app" label="Приложение авторизации" variant="filled">
        <MenuItem value="windows">Windows</MenuItem>
        <MenuItem value="windowsPhone">Windows Phone</MenuItem>
        <MenuItem value="android">Android</MenuItem>
        <MenuItem value="iphone">iPhone</MenuItem>
        <MenuItem value="ipad">iPad</MenuItem>
      </MyTextField>
      <MyTextField fullWidth name="username" label="Телефон или email" type="text" variant="filled"/>
      <MyTextField fullWidth name="password" label="Пароль" type="password" variant="filled"/>
    </>
  )
}

export default StaticFields
