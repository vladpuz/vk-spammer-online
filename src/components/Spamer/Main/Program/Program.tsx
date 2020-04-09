import React from 'react'
import s from './Program.module.css'
import Workspace from './Workspace/Workspace'
import Addressees from './Addressees/Addressees'
import { Formik, Form } from 'formik'
import { spamModeType } from '../../../../types/types'
import { useDispatch, useSelector } from 'react-redux'
import { addLogItem, setSpamIsRun } from '../../../../redux/spamer-reducer'
import bs from '../../../../utils/BrowserStorage'
import { rootReducerType } from '../../../../redux/store'
import Spamer from '../../../../utils/Spamer'
import addresses from '../../../../utils/addresses'

function Program () {
  const accounts = useSelector((state: rootReducerType) => state.accountsReducer.accounts)
  const currentAddresseeIndex = useSelector(
    (state: rootReducerType) => state.spamerReducer.pauseData.currentAddresseeIndex
  )
  const currentSenderIndex = useSelector((state: rootReducerType) => state.spamerReducer.pauseData.currentSenderIndex)
  const autoPauseTimeout = useSelector((state: rootReducerType) => state.spamerReducer.pauseData.autoPauseTimeout)
  const dispatch = useDispatch()

  return (
    <Formik
      initialValues={{
        message: bs.local.get('fields.message') || '',
        attachment: bs.local.get('fields.attachment') || '',
        sendInterval: bs.local.get('fields.sendInterval') || '10',
        autoPauseTimeout: bs.local.get('fields.autoPauseTimeout') || '',
        onePass: bs.local.get('fields.onePass') || false,
        antiCaptcha: bs.local.get('fields.antiCaptcha') || false,
        spamMode: (bs.local.get('fields.spamMode') || 'pm') as spamModeType,
        addressees: addresses.getLocalValue(bs.local.get('fields.spamMode')) || ''
      }}

      onSubmit={(values, { setErrors, setFieldError }) => {
        if (!accounts.length) dispatch(addLogItem('Нету ни одного аккаунта', 'warning'))
        else if (!accounts.some(account => account.isEnabled)) dispatch(addLogItem('Все аккаунты выключены', 'warning'))
        if (!values.message && !values.attachment) {
          setErrors({
            message: 'Сообщение обязательно если не указаны вложения',
            attachment: 'Вложения обязательны если не указано сообщение'
          })
        }
        if (!values.addressees) setFieldError('addressees', 'Укажите адресаты спама')

        if (
          (values.message || values.attachment) &&
          values.addressees &&
          accounts.length &&
          accounts.some(account => account.isEnabled)
        ) {
          dispatch(setSpamIsRun(true))
          dispatch(addLogItem('Рассылка начата', 'info'))
          new Spamer({
            ...values,
            attachment: values.attachment,
            addressees: values.addressees.split('\n').filter((str: string) => str),
            message: values.message.split('\n').join('%0A')
          }, { currentAddresseeIndex, currentSenderIndex, autoPauseTimeout }).start()
        }
      }}
    >
      <Form>
        <div className={s.spamer}>
          <Workspace/>
          <Addressees/>
        </div>
      </Form>
    </Formik>
  )
}

export default Program
