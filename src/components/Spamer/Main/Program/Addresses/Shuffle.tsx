import React from 'react'
import lodash from 'lodash'
import { Button } from '@material-ui/core'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import { useFormikContext } from 'formik'
import { useSelector } from 'react-redux'
import { StateType } from '../../../../../redux/store'
import storage from 'store2'

function Shuffle () {
  const { values, setFieldValue }: { values: any, setFieldValue: any } = useFormikContext()
  const spamOnPause = useSelector((state: StateType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: StateType) => state.spamerReducer.spamOnRun)

  return (
    <Button
      fullWidth
      disabled={spamOnPause || spamOnRun}
      variant="contained"
      color="default"
      component="span"
      startIcon={<ShuffleIcon/>}
      onClick={() => {
        const arr = values.addresses.split('\n').filter((str: string) => str)
        const sortStr = lodash.shuffle(arr).join('\n')
        setFieldValue('addresses', sortStr)

        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addresses: {
            ...fields.addresses,
            [values.spamMode]: sortStr
          }
        })
      }}
    >
      Перемешать
    </Button>
  )
}

export default Shuffle
