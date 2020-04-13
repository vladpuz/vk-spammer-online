import React from 'react'
import { Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { useFormikContext } from 'formik'
import addresses from '../../../../../utils/addresses'
import { useSelector } from 'react-redux'
import { RootReducerType } from '../../../../../redux/store'

function Upload () {
  const { values, setFieldValue } = useFormikContext()
  const spamOnPause = useSelector((state: RootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: RootReducerType) => state.spamerReducer.spamOnRun)

  return (
    <div style={{ marginBottom: '10px' }}>
      <input
        disabled={spamOnPause || spamOnRun}
        id="uploadSpamAddressees"
        type="file"
        style={{ display: 'none' }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const target = e.currentTarget as HTMLInputElement
          const file: File = (target.files as FileList)[0]
          const reader = new FileReader()
          reader.readAsText(file)
          reader.onload = () => {
            // @ts-ignore
            addresses.setLocalValue(values.spamMode, reader.result)
            setFieldValue('addressees', reader.result)
          }
        }}
      />
      <label htmlFor="uploadSpamAddressees">
        <Button
          fullWidth
          disabled={spamOnPause || spamOnRun}
          variant="contained"
          color="default"
          component="span"
          startIcon={<CloudUploadIcon/>}>
          Загрузить из файла
        </Button>
      </label>
    </div>
  )
}

export default Upload
