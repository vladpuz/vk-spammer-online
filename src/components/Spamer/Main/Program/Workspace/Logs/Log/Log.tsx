import React from 'react'
import s from './Log.module.css'
import { logStateType } from '../../../../../../../types/types'
import useLogData from './useLogData'

interface IProps {
  title: string
  state: logStateType
  time: string
}

function Log ({ title, state, time }: IProps) {
  const [color, Icon] = useLogData(state)

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
