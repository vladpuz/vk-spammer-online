import React, { useState } from 'react'
import s from './Addresses.module.css'
import Select from './Select'
import Upload from './Upload'
import Shuffle from './Shuffle'
import FieldAddresses from './FieldAddresses/FieldAddresses'
import { useFormikContext } from 'formik'
import getPlaceholder from '../../../../../utils/get-placeholder'

function Addresses () {
  const { values } : { values: any } = useFormikContext()
  const [placeholder, setPlaceholder] = useState(getPlaceholder(values.spamMode))

  return (
    <div className={s.addresses}>
      <Select setPlaceholder={setPlaceholder}/>
      <FieldAddresses placeholder={placeholder}/>
      <div className={s.buttons}>
        <Upload/>
        <Shuffle/>
      </div>
    </div>
  )
}

export default Addresses
