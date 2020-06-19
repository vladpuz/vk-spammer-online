import React from 'react'
import s from './Log.module.css'
import { LogStatusType } from '../../../../../../../types/types'
import { CircularProgress, withStyles } from '@material-ui/core'
import cn from 'classnames'
import ErrorIcon from '@material-ui/icons/Error'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import InfoIcon from '@material-ui/icons/Info'
import HourglassFullIcon from '@material-ui/icons/HourglassFull'

const ColorCircularProgress = withStyles({
  root: {
    color: '#191919'
  }
})(CircularProgress)

type Props = {
  title: string
  status: LogStatusType
  time: string
}

function Log ({ title, status, time }: Props) {
  let Icon: any
  if (status === 'error') Icon = ErrorIcon
  if (status === 'success') Icon = CheckCircleIcon
  if (status === 'warning') Icon = WarningIcon
  if (status === 'info') Icon = InfoIcon
  if (status === 'pending') Icon = HourglassFullIcon

  return (
    <div className={cn(s.log, s[status])}>
      <div className={s.title}>
        <Icon fontSize="small"/>
        <span className={s.title__text}>
          {title}
        </span>
      </div>
      <div className={s.right}>
        {status === 'pending' && <ColorCircularProgress size={20}/>}
        <time className={s.time}>
          {time}
        </time>
      </div>
    </div>
  )
}

export default Log
