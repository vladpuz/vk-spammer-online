import React from 'react'
import s from './Buttons.module.css'
import { Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import DeleteIcon from '@material-ui/icons/Delete'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SdStorageIcon from '@material-ui/icons/SdStorage'
import { clearAccounts, setIsEnabledAll, shuffleAccounts } from '../../../../../redux/accounts-reducer'
import { useDispatch } from 'react-redux'

function Buttons () {
  const dispatch = useDispatch()

  return (
    <div className={s.buttons}>
      <div className={s.col}>
        <input id="uploadSpamAddressees" type="file" style={{ display: 'none' }}/>
        <label htmlFor="uploadSpamAddressees">
          <Button fullWidth variant="outlined" color="default" component="span" startIcon={<CloudUploadIcon/>}>
            Загрузить из файла
          </Button>
        </label>
        <Button fullWidth variant="outlined" startIcon={<ShuffleIcon/>} onClick={() => {dispatch(shuffleAccounts())}}>
          Перемешать аккаунты
        </Button>
      </div>

      <div className={s.col}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddCircleIcon/>}
          onClick={() => {dispatch(setIsEnabledAll(true))}}
        >
          Включить все аккаунты
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RemoveCircleIcon/>}
          onClick={() => {dispatch(setIsEnabledAll(false))}}
        >
          Выключить все аккаунты
        </Button>
      </div>

      <div className={s.col}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<DeleteIcon/>}
          onClick={() => {dispatch(clearAccounts())}}
        >
          Удалить все аккаунты
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<SdStorageIcon/>}
          onClick={() => {
            localStorage.removeItem('fields')
            window.location.reload()
          }}
        >
          Очистить поля форм
        </Button>
      </div>
    </div>
  )
}

export default Buttons
