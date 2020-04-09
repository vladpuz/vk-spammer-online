import React from 'react'
import s from './Workspace.module.css'
import Logs from './Logs/Logs'
import Fields from './Fields/Fields'
import Settings from './Settings/Settings'
import Buttons from './Buttons/Buttons'

function Workspace () {
  return (
    <div className={s.workspace}>
      <Fields/>
      <Settings/>
      <Buttons/>
      <Logs/>
    </div>
  )
}

export default Workspace
