import React from 'react'
import s from './Settings.module.css'
import { Box, FormControlLabel, InputAdornment, Radio } from '@material-ui/core'
import MyTextField from '../../../../../common/MyTextField'
import MyCheckbox from '../../../../../common/MyCheckbox'
import bs from '../../../../../../utils/BrowserStorage'
import MyRadioGroup from '../../../../../common/MyRadioGroup'

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
            inputProps={{ min: '0', step: 'any' }}
            variant="filled"
            type="number"
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
            inputProps={{ min: '0', step: 'any' }}
            variant="filled"
            type="number"
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
            size="small"
            name="onePass"
            color="secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              bs.local.set('fields.onePass', e.currentTarget.checked)
            }}
          />
        } label="Один проход"/>

        <MyRadioGroup
          row
          aria-label="captchaMode"
          name="captchaMode"
          onChange={(e) => {
            bs.local.set('fields.captchaMode', e.target.value)
          }}>
          <FormControlLabel control={
            <Radio
              size="small"
              color="secondary"
              value="Антикапча"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                bs.local.set('fields.antiCaptcha', e.currentTarget.checked)
              }}
            />
          } label="Антикапча"/>
          <FormControlLabel control={
            <Radio
              size="small"
              color="secondary"
              value="Показывать капчу"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                bs.local.set('fields.antiCaptcha', e.currentTarget.checked)
              }}
            />
          } label="Показывать капчу"/>
          <FormControlLabel control={
            <Radio
              size="small"
              color="secondary"
              value="Игнорировать капчу"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                bs.local.set('fields.antiCaptcha', e.currentTarget.checked)
              }}
            />
          } label="Игнорировать капчу"/>
        </MyRadioGroup>
      </div>
    </>
  )
}

export default Settings
