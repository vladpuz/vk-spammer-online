import React from 'react'
import { addLogItem, setSpamOnPause } from '../../../../../../redux/spamer-reducer'
import Button from '@material-ui/core/Button'
import { useDispatch, useSelector } from 'react-redux'
import { rootReducerType } from '../../../../../../redux/store'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import submit from '../../../../../../utils/submit'
import { useFormikContext } from 'formik'

function ResumeButton () {
  const dispatch = useDispatch()
  const { values, setErrors, setFieldError }: any = useFormikContext()
  const spamOnPause = useSelector((state: rootReducerType) => state.spamerReducer.spamOnPause)

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<SkipNextIcon/>}
      onClick={() => {
        submit(
          { ...values, addressees: values.addressees.split('\n').filter((str: string) => str) },
          setErrors,
          setFieldError,
          () => {
            dispatch(addLogItem('Рассылка продолжена', 'info'))
          }
        )
        dispatch(setSpamOnPause(!spamOnPause))
      }}
    >
      Продолжить
    </Button>
  )
}

export default ResumeButton
