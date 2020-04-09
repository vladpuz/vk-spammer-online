import React from 'react'
import s from './Buttons.module.css'
import Button from '@material-ui/core/Button'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import ClearIcon from '@material-ui/icons/Clear'
import PauseIcon from '@material-ui/icons/Pause'
import { Box } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { clearLog, setSpamIsRun, setSpamOnpause, addLogItem } from '../../../../../../redux/spamer-reducer'
import store, { rootReducerType } from '../../../../../../redux/store'
import Spamer from '../../../../../../utils/Spamer'
import { clearCurrentSender } from '../../../../../../redux/accounts-reducer'
import { useFormikContext } from 'formik'

function Buttons () {
  const spamIsRun = useSelector((state: rootReducerType) => state.spamerReducer.spamIsRun)
  const spamOnPause = useSelector((state: rootReducerType) => state.spamerReducer.spamOnPause)
  const dispatch = useDispatch()
  const buttonWidth = 200
  const { values, setFieldError, setErrors }: any = useFormikContext()
  const accounts = useSelector((state: rootReducerType) => state.accountsReducer.accounts)
  const currentAddresseeIndex = useSelector(
    (state: rootReducerType) => state.spamerReducer.pauseData.currentAddresseeIndex
  )
  const currentSenderIndex = useSelector((state: rootReducerType) => state.spamerReducer.pauseData.currentSenderIndex)
  const autoPauseTimeout = useSelector((state: rootReducerType) => state.spamerReducer.pauseData.autoPauseTimeout)
  const sendOperations = useSelector((state: rootReducerType) => state.spamerReducer.sendOperations)

  return (
    <div className={s.buttons}>
      {
        spamIsRun ? (
          <Box width={buttonWidth}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={spamOnPause ? <PlayArrowIcon/> : <PauseIcon/>}
              onClick={() => {
                if (!spamOnPause) {
                  clearInterval(store.getState().spamerReducer.senderTimerID)
                  clearInterval(store.getState().spamerReducer.spamTimerID)
                  dispatch(addLogItem('Рассылка приостановлена', 'info'))
                }
                if (spamOnPause) {
                  if (!accounts.length) dispatch(addLogItem('Нету ни одного аккаунта', 'warning'))
                  if (!accounts.some(account => account.isEnabled)) dispatch(
                    addLogItem('Все аккаунты выключены', 'warning'))
                  if (!values.message && !values.attachment) {
                    setErrors({
                      message: 'Сообщение обязательно если не указаны вложения',
                      attachment: 'Вложения обязательны если не указано сообщение'
                    })
                  }
                  if (!values.addressees) setFieldError('addressees', 'Укажите адресаты спама')

                  dispatch(addLogItem('Рассылка продолжена', 'info'))
                  if (
                    (values.message || values.attachment) &&
                    values.addressees &&
                    accounts.length &&
                    accounts.some(account => account.isEnabled)
                  ) {
                    dispatch(setSpamIsRun(true))
                    new Spamer({
                      ...values,
                      attachment: values.attachment,
                      addressees: values.addressees.split('\n').filter((str: string) => str),
                      message: values.message.split('\n').join('%0A')
                    }, { currentAddresseeIndex, currentSenderIndex, autoPauseTimeout }).start()
                  }
                }
                dispatch(setSpamOnpause(!spamOnPause))

              }}
            >
              {spamOnPause ? 'Снять паузу' : 'Поставить паузу'}
            </Button>
          </Box>
        ) : (
          <Box width={buttonWidth}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon/>}
            >
              Начать спам
            </Button>
          </Box>
        )
      }

      <Box width={buttonWidth}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<StopIcon/>}
          disabled={!spamIsRun}
          onClick={() => {
            Spamer.stop()
            dispatch(setSpamOnpause(false))
            dispatch(setSpamIsRun(false))
            Promise.all(sendOperations).then(() => {
              dispatch(addLogItem('Рассылка прекращена', 'info'))
            })
            dispatch(clearCurrentSender())
          }}
        >
          Прервать спам
        </Button>
      </Box>

      <Box width={buttonWidth}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<ClearIcon/>}
          onClick={() => {dispatch(clearLog())}}
        >
          Очистить лог
        </Button>
      </Box>
    </div>
  )
}

export default Buttons
