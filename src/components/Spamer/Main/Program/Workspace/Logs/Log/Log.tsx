import React from 'react'
import s from './Log.module.css'
import { logStatusType } from '../../../../../../../types/types'
import useLogData from './useLogData'
import { CircularProgress, withStyles } from '@material-ui/core'

const ColorCircularProgress = withStyles({
  root: {
    color: '#191919',
  },
})(CircularProgress)

interface IProps {
  title: string
  status: logStatusType
  loading: boolean
  time: string
}

function Log ({ title, status, loading, time }: IProps) {
  const [color, Icon] = useLogData(status)

  return (
    <div className={s.log} style={{ backgroundColor: color }}>
      <div className={s.title}>
        <Icon fontSize="small"/>
        <span className={s.title__text}>
          {title}
        </span>
      </div>
      <div className={s.right}>
        {loading && <ColorCircularProgress size={20}/>}
        <time className={s.time}>
          {time}
        </time>
      </div>
    </div>
  )
}

export default Log
