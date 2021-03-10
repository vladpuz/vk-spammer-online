import React from 'react'
import s from './Spamer.module.css'
import Sidebar from './Sidebar/Sidebar'
import Main from './Main/Main'
import storage from 'store2'
import { SpamModeType } from '../../types/types'
import { addLogItem } from '../../redux/ducks/spamer/action-creators'
import { Form, Formik } from 'formik'
import { useDispatch } from 'react-redux'
import start from '../../redux/thunks/spam/start/start'

function Spamer () {
  const dispatch = useDispatch()
  const checkValue = (value: number | string, defaultValue: number | string): number | string => {
    if (typeof value !== 'undefined') {
      if (typeof value === 'string') return value
      return +value
    }
    return defaultValue
  }

  return (
    <Formik
      initialValues={{
        autoSwitchTime: checkValue(storage.local.get('fields')?.autoSwitchTime, 300),
        antiCaptchaKey: storage.local.get('fields')?.antiCaptchaKey || '',
        message: storage.local.get('fields')?.message || '',
        attachment: storage.local.get('fields')?.attachment || '',
        sendInterval: storage.local.get('fields')?.sendInterval || 10,
        autoPauseTimeout: checkValue(storage.local.get('fields')?.autoPauseTimeout, ''),
        onePass: storage.local.get('fields')?.onePass || false,
        captchaMode: storage.local.get('fields')?.captchaMode || 'Показывать капчу',
        spamMode: (storage.local.get('fields')?.spamMode || 'pm') as SpamModeType,
        addresses: storage.get('fields')?.addresses || ''
      }}
      onSubmit={(values, { setFieldError }) => {
        dispatch(start(
          addLogItem('Рассылка начата', 'info', `Рассылка начата - ${Date.now()}`),
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
      <Form id="globalForm">
        <div className={s.flex}>
          <Sidebar/>
          <Main/>
        </div>
      </Form>
    </Formik>
  )
}

export default Spamer
