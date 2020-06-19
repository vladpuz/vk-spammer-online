import React from 'react'
import s from './Logs.module.css'
import Log from './Log/Log'
import { useSelector } from 'react-redux'
import { StateType } from '../../../../../../redux/store'

function Logs () {
  const logs = useSelector((state: StateType) => state.spamerReducer.logs)

  return (
    <div className={s.logs}>
      {
        logs.map(log => {
          return <Log key={log.key} title={log.title} status={log.status} time={log.time}/>
        })
      }
    </div>
  )
}

export default Logs
