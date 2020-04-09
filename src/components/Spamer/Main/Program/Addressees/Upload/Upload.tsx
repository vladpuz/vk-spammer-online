import React from 'react'
import { Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

function Upload () {
  return (
    <div style={{ marginBottom: '10px' }}>
      <input id="uploadSpamAddressees" type="file" style={{ display: 'none' }}/>
      <label htmlFor="uploadSpamAddressees">
        <Button fullWidth variant="contained" color="default" component="span" startIcon={<CloudUploadIcon/>}>
          Загрузить из файла
        </Button>
      </label>
    </div>
  )
}

export default Upload
