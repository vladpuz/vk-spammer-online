import React from 'react'
import { addLogItem } from '../../../../../../redux/ducks/spamer/action-creators'
import Button from '@material-ui/core/Button'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import validate from '../../../../../../utils/spam/validate'
import { useFormikContext } from 'formik'

function ResumeButton () {
  const { values, setFieldError }: any = useFormikContext()

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<SkipNextIcon/>}
      onClick={() => {
        validate(
          { ...values, addresses: values.addresses.split('\n').filter((str: string) => str) },
          setFieldError,
          addLogItem('Рассылка продолжена', 'info', `Рассылка продолжена - ${Date.now()}`)
        )
      }}
    >
      Продолжить
    </Button>
  )
}

export default ResumeButton
