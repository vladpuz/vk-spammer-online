import React from 'react'
import s from './Settings.module.css'
import { Box, FormControlLabel, InputAdornment } from '@material-ui/core'
import MyTextField from '../../../../../common/MyTextField'
import MyCheckbox from '../../../../../common/MyCheckbox'
import bs from '../../../../../../utils/BrowserStorage'

function Settings () {
  const fieldWidth = 250

  return (
    <>
      <div className={s.times}>
        <Box width={fieldWidth}>
          <MyTextField
            fullWidth
            name="sendInterval"
            label="Интервал отправки"
            InputProps={{
              startAdornment: <InputAdornment position="start">секунды:</InputAdornment>,
            }}
            variant="filled"
            type="number"
            inputProps={{ min: '0' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              bs.local.set('fields.sendInterval', e.currentTarget.value)
            }}
          />
        </Box>
        <Box width={fieldWidth}>
          <MyTextField
            fullWidth
            name="autoPauseTimeout"
            label="Время до автопаузы"
            InputProps={{
              startAdornment: <InputAdornment position="start">минуты:</InputAdornment>,
            }}
            variant="filled"
            type="number"
            inputProps={{ min: '0' }}
            placeholder="никогда"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              bs.local.set('fields.autoPauseTimeout', e.currentTarget.value)
            }}
          />
        </Box>
      </div>

      <div className={s.checkboxes}>
        <FormControlLabel control={
          <MyCheckbox
            name="onePass"
            color="secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              bs.local.set('fields.onePass', e.currentTarget.checked)
            }}
          />
        } label="Только один проход"/>

        <FormControlLabel control={
          <MyCheckbox
            name="antiCaptcha"
            color="secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              bs.local.set('fields.antiCaptcha', e.currentTarget.checked)
            }}
          />
        } label="Антикапча"/>
      </div>
    </>
  )
}

export default Settings
