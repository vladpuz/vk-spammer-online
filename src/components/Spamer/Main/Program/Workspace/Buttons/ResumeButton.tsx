import React from 'react'
import { addLogItem } from '../../../../../../redux/ducks/spamer/action-creators'
import Button from '@material-ui/core/Button'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import { useFormikContext } from 'formik'
import { useDispatch } from 'react-redux'
import start from '../../../../../../redux/thunks/spam/start/start'

function ResumeButton () {
  const { values, setFieldError } = useFormikContext<any>()
  const dispatch = useDispatch()

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<SkipNextIcon/>}
      onClick={() => {
        dispatch(start(
          addLogItem('Рассылка продолжена', 'info', `Рассылка продолжена - ${Date.now()}`),
          {
            ...values,
            autoSwitchTime: +values.autoSwitchTime,
            autoPauseTimeout: +values.autoPauseTimeout,
            addresses: values.addresses.split('\n').filter((str: string) => str)
          },
          setFieldError
        ))
      }}
    >
      Продолжить
    </Button>
  )
}

export default ResumeButton
