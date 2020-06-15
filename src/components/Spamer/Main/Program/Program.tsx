import React from 'react'
import s from './Program.module.css'
import Workspace from './Workspace/Workspace'
import Addresses from './Addresses/Addresses'
import CaptchaDialog from './CaptchaDialog/CaptchaDialog'

function Program () {
  return (
    <div className={s.spamer}>
      <Workspace/>
      <Addresses/>
      <CaptchaDialog/>
    </div>
  )
}

export default Program
