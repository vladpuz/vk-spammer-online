import React from 'react'
import PauseIcon from '@material-ui/icons/Pause'
import Button from '@material-ui/core/Button'
import pause from '../../../../../../utils/spam/pause'
import { useFormikContext } from 'formik'
import { addLogItem } from '../../../../../../redux/ducks/spamer/action-creators'

function PauseButton () {
  const { values }: any = useFormikContext()

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<PauseIcon/>}
      onClick={() => {
        pause(
          addLogItem('Рассылка приостановлена', 'info', `Рассылка приостановлена - ${Date.now()}`),
          values.autoSwitchTime
        )
      }}
    >
      Пауза
    </Button>
  )
}

export default PauseButton
