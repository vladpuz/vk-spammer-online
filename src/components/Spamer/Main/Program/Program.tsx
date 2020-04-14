import React from 'react'
import s from './Program.module.css'
import Workspace from './Workspace/Workspace'
import Addressees from './Addressees/Addressees'
import { Formik, Form } from 'formik'
import { SpamModeType } from '../../../../types/types'
import bs from '../../../../utils/BrowserStorage'
import addresses from '../../../../utils/addresses'
import submit from '../../../../utils/submit'
import { addLogItem } from '../../../../redux/spamer-reducer'
import { useDispatch } from 'react-redux'

function Program () {
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
        ignoreCaptcha: bs.local.get('fields.ignoreСaptcha') || false,
        spamMode: (bs.local.get('fields.spamMode') || 'pm') as SpamModeType,
        addressees: addresses.getLocalValue(bs.local.get('fields.spamMode') || 'pm') || '',
      }}
      onSubmit={(values, { setFieldError }) => {
        submit(
          { ...values, addressees: values.addressees.split('\n').filter((str: string) => str) },
          setFieldError,
          () => {
            dispatch(addLogItem(
              'Рассылка начата',
              'info',
              `${Date.now()} Рассылка начата info`,
            ))
          },
        )
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
