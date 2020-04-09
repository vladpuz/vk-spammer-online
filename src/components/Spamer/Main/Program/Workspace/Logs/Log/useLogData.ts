import { logStateType } from '../../../../../../../types/types'
import { ReactNode, useEffect, useState } from 'react'
import ErrorIcon from '@material-ui/icons/Error'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import InfoIcon from '@material-ui/icons/Info'

function useLogData (state: logStateType) {
  const [color, setColor] = useState()
  const [Icon, setIcon] = useState<ReactNode>('s')

  useEffect(() => {
    switch (state) {
      case 'error':
        setColor('#e57373')
        setIcon(ErrorIcon)
        break

      case 'success':
        setColor('#81c784')
        setIcon(CheckCircleIcon)
        break

      case 'warning':
        setColor('#ffb74d')
        setIcon(WarningIcon)
        break

      case 'info':
        setColor('#64b5f6')
        setIcon(InfoIcon)
        break
    }
  }, [state])

  return [color, Icon]
}

export default useLogData
