import React from 'react'
import { Button } from '@material-ui/core'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import { useFormikContext } from 'formik'
import shuffle from '../../../../../../utils/shuffle'
import bs from '../../../../../../utils/BrowserStorage'

function Shuffle () {
  const { values, setFieldValue } = useFormikContext()

  return (
    <Button
      fullWidth
      variant="contained"
      color="default"
      component="span"
      startIcon={<ShuffleIcon/>}
      onClick={() => {
        // @ts-ignore
        const arr = values.addressees.split('\n').filter(str => str)
        const sortStr = shuffle(arr).join('\n')
        setFieldValue('addressees', sortStr)
        // @ts-ignore
        bs.local.set(`fields.addressees.${values.spamMode}`, sortStr)
      }}
    >
      Перемешать
    </Button>
  )
}

export default Shuffle
