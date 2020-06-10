import React, { useState } from 'react'
import s from './Addressees.module.css'
import Select from './Select'
import Upload from './Upload'
import Shuffle from './Shuffle'
import FieldAddressees from './FieldAddressees/FieldAddressees'
import { useFormikContext } from 'formik'
import addresses from '../../../../../utils/addresses'

function Addressees () {
  const { values } : { values: any } = useFormikContext()
  const [placeholder, setPlaceholder] = useState(addresses.getPlaceholder(values.spamMode))

  return (
    <div className={s.addressees}>
      <Select setPlaceholder={setPlaceholder}/>
      <FieldAddressees placeholder={placeholder}/>
      <div className={s.buttons}>
        <Upload/>
        <Shuffle/>
      </div>
    </div>
  )
}

export default Addressees
