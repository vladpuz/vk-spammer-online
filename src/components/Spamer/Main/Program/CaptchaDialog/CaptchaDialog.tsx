import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  DialogActions,
  Paper,
  Box
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducerType } from '../../../../../redux/store'
import Draggable from 'react-draggable'
import { Form, Formik, useFormikContext } from 'formik'
import {
  addLogItem,
  clearCaptcha,
  setNotificationTimerId,
  unravelCaptchaItem
} from '../../../../../redux/spamer-reducer'
import MyTextField from '../../../../common/MyTextField'
import validate from '../../../../../utils/spam/validate'
import stop from '../../../../../utils/spam/stop'

function PaperComponent (props: any) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

function CaptchaDialog () {
  const dispatch = useDispatch()
  const captcha = useSelector((state: RootReducerType) => state.spamerReducer.captcha).filter(item => !item.captchaKey)
  const notificationTimerId = useSelector((state: RootReducerType) => state.spamerReducer.timers.notificationTimerId)
  const { values: spamValues, setFieldError: spamSetFieldError }: any = useFormikContext()

  useEffect(() => {
    if (captcha.length) {
      const timerId = window.setInterval(() => {
        document.title = 'Требуется капча'
        window.setTimeout(() => {
          document.title = 'VK_SPAMER_ONLINE - Бесплатный спамер для вк'
        }, 1250)
      }, 2500)

      document.title = 'Требуется капча'
      window.setTimeout(() => {
        document.title = 'VK_SPAMER_ONLINE - Бесплатный спамер для вк'
      }, 1250)

      dispatch(setNotificationTimerId(timerId))
    } else {
      clearInterval(notificationTimerId)
    }
  }, [captcha.length])

  const initialValues: any = {}
  for (const item of captcha) {
    initialValues[item.userId] = ''
  }

  const handleClose = () => {
    dispatch(clearCaptcha())
    stop(addLogItem('Спам остановлен', 'info', `Спам остановлен - ${Date.now()}`), spamValues)
  }

  return (
    <Dialog
      open={!!captcha.length && spamValues.captchaMode !== 'Антикапча'}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Понадобилась капча
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Рассылка поставлена на паузу, для продолжения введите капчу
        </DialogContentText>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setFieldError }) => {
            let ok = true
            for (const item of Object.entries(values)) {
              const [userId, captchaKey] = item

              if (!captchaKey) {
                setFieldError(userId, 'Введите капчу')
                ok = false
              } else {
                // @ts-ignore
                dispatch(unravelCaptchaItem(+userId, captchaKey))
              }
            }

            if (ok) {
              validate(
                { ...spamValues, addresses: spamValues.addresses.split('\n').filter((str: string) => str) },
                spamSetFieldError,
                addLogItem('Рассылка продолжена', 'info', `Рассылка продолжена - ${Date.now()}`)
              )
            }
          }}
        >
          <Form>
            {
              captcha.map((item, index) => {
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                    <img src={item.captchaImg} alt="captcha" style={{ marginRight: '20px' }}/>
                    <Box width={250}>
                      <MyTextField fullWidth name={item.userId.toString()} label="Введите капчу с картинки"/>
                    </Box>
                  </div>
                )
              })
            }
            <DialogActions>
              <Box width={150}>
                <Button fullWidth autoFocus variant="contained" color="primary" onClick={handleClose}>
                  Отмена
                </Button>
              </Box>
              <Box width={150}>
                <Button fullWidth variant="contained" color="primary" type="submit">
                  Продолжить
                </Button>
              </Box>
            </DialogActions>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default CaptchaDialog
