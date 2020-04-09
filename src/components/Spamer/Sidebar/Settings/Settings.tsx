import React from 'react'
import s from './Settings.module.css'
import AddAccounts from './AddAccounts/AddAccounts'
import AutoSwitchTime from './AutoSwitchTime/AutoSwitchTime'
import AntiCaptchaKey from './AntiCaptchaKey/AntiCaptchaKey'

function Settings () {
  return (
    <div className={s.settings}>
      <div className={s.button}>
        <AddAccounts/>
      </div>
      <div className={s.inputs}>
        <AutoSwitchTime/>
        <AntiCaptchaKey/>
      </div>
    </div>
  )
}

export default Settings
