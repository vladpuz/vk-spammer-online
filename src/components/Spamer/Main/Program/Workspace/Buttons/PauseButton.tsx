import React from 'react'
import PauseIcon from '@material-ui/icons/Pause'
import Button from '@material-ui/core/Button'
import Spamer from '../../../../../../utils/Spamer'

function PauseButton () {
  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<PauseIcon/>}
      onClick={() => {
        Spamer.pause('Рассылка приостановлена', 'info')
      }}
    >
      Пауза
    </Button>
  )
}

export default PauseButton
