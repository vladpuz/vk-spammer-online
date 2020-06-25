import React from 'react'
import PauseIcon from '@material-ui/icons/Pause'
import Button from '@material-ui/core/Button'
import { useFormikContext } from 'formik'
import { addLogItem } from '../../../../../../redux/ducks/spamer/action-creators'
import { useDispatch } from 'react-redux'
import pause from '../../../../../../redux/thunks/spam/pause/pause'

function PauseButton () {
  const { values }: any = useFormikContext()
  const dispatch = useDispatch()

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<PauseIcon/>}
      onClick={() => {
        dispatch(
          pause(
            addLogItem('Рассылка приостановлена', 'info', `Рассылка приостановлена - ${Date.now()}`),
            values.autoSwitchTime
          )
        )
      }}
    >
      Пауза
    </Button>
  )
}

export default PauseButton
