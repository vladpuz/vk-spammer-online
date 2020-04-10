import React from 'react'
import s from './Log.module.css'
import { logStatusType } from '../../../../../../../types/types'
import useLogData from './useLogData'

interface IProps {
  title: string
  status: logStatusType
  time: string
}

function Log ({ title, status, time }: IProps) {
  const [color, Icon] = useLogData(status)

  return (
    <div className={s.log} style={{ backgroundColor: color }}>
      <div className={s.title}>
        <Icon fontSize="small"/>
        <span className={s.title__text}>
          {title}
        </span>
      </div>
      <time className={s.time}>{time}</time>
    </div>
  )
}

export default Log
