import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  DialogActions,
  Paper,
  Box,
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducerType } from '../../../../../redux/store'
import Draggable from 'react-draggable'
import { Form, Formik, useFormikContext } from 'formik'
import { addLogItem, clearCaptcha, unravelCaptchaItem } from '../../../../../redux/spamer-reducer'
import MyTextField from '../../../../common/MyTextField'
import submit from '../../../../../utils/submit'
import Spamer from '../../../../../utils/Spamer'

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
  const { values: spamValues, setFieldError: spamSetFieldError }: any = useFormikContext()

  const initialValues: any = {}
  for (let item of captcha) {
    initialValues[item.userID] = ''
  }

  const handleClose = () => {
    dispatch(clearCaptcha())
    Spamer.stop('Спам остановлен', 'info')
  }

  return (
    <Dialog
      open={!!captcha.length}
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
            console.log(values)
            for (let item of Object.entries(values)) {
              const [userID, captchaKey] = item
              console.log(userID)

              if (!captchaKey) {
                setFieldError(userID, 'Введите капчу')
                ok = false
              } else {
                // @ts-ignore
                dispatch(unravelCaptchaItem(+userID, captchaKey))
              }
            }

            if (ok) {
              submit(
                { ...spamValues, addressees: spamValues.addressees.split('\n').filter((str: string) => str) },
                spamSetFieldError,
                () => {
                  dispatch(addLogItem(
                    'Рассылка продолжена',
                    'info',
                    `${Date.now()} Рассылка начата info`,
                  ))
                },
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
                      <MyTextField fullWidth name={item.userID.toString()} label="Введите капчу с картинки"/>
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
