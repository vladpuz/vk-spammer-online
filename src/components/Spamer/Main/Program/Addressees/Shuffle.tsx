import React from 'react'
import { Button } from '@material-ui/core'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import { useFormikContext } from 'formik'
import shuffle from '../../../../../utils/shuffle'
import { useSelector } from 'react-redux'
import { RootReducerType } from '../../../../../redux/store'
import storage from 'store2'

function Shuffle () {
  const { values, setFieldValue }: { values: any, setFieldValue: any } = useFormikContext()
  const spamOnPause = useSelector((state: RootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: RootReducerType) => state.spamerReducer.spamOnRun)

  return (
    <Button
      fullWidth
      disabled={spamOnPause || spamOnRun}
      variant="contained"
      color="default"
      component="span"
      startIcon={<ShuffleIcon/>}
      onClick={() => {
        const arr = values.addressees.split('\n').filter((str: string) => str)
        const sortStr = shuffle(arr).join('\n')
        setFieldValue('addressees', sortStr)

        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
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
