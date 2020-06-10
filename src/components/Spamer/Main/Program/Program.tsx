import React from 'react'
import s from './Program.module.css'
import Workspace from './Workspace/Workspace'
import Addressees from './Addressees/Addressees'
import { Formik, Form } from 'formik'
import { SpamModeType } from '../../../../types/types'
import addresses from '../../../../utils/addresses'
import submit from '../../../../utils/submit'
import { addLogItem } from '../../../../redux/spamer-reducer'
import { useDispatch } from 'react-redux'
import CaptchaDialog from './CaptchaDialog/CaptchaDialog'
import storage from 'store2'

function Program () {
  const dispatch = useDispatch()

  return (
    <Formik
      initialValues={{
        message: storage.local.get('fields')?.message || '',
        attachment: storage.local.get('fields')?.attachment || '',
        sendInterval: storage.local.get('fields')?.sendInterval || '10',
        autoPauseTimeout: storage.local.get('fields')?.autoPauseTimeout || '',
        onePass: storage.local.get('fields')?.onePass || false,
        captchaMode: storage.local.get('fields')?.captchaMode || 'Игнорировать капчу',
        spamMode: (storage.local.get('fields')?.spamMode || 'pm') as SpamModeType,
        addressees: addresses.getLocalValue(storage.local.get('fields')?.spamMode || 'pm') || ''
      }}
      onSubmit={(values, { setFieldError }) => {
        submit(
          { ...values, addressees: values.addressees.split('\n').filter((str: string) => str) },
          setFieldError,
          () => {
            dispatch(addLogItem(
              'Рассылка начата',
              'info',
              `${Date.now()} Рассылка начата info`
            ))
          }
        )
      }}
    >
      <Form>
        <div className={s.spamer}>
          <Workspace/>
          <Addressees/>
          <CaptchaDialog/>
        </div>
      </Form>
    </Formik>
  )
}

export default Program
