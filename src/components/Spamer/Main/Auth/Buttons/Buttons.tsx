import React from 'react'
import s from './Buttons.module.css'
import { Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import DeleteIcon from '@material-ui/icons/Delete'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SdStorageIcon from '@material-ui/icons/SdStorage'
import {
  clearAccounts,
  setIsEnabledAll,
  shuffleAccounts
} from '../../../../../redux/ducks/accounts/action-creators'
import { login } from '../../../../../redux/ducks/accounts/thunk-creators'
import { useDispatch, useSelector } from 'react-redux'
import { AuthAppType } from '../../../../../types/types'
import { StateType } from '../../../../../redux/store'
import lodash from 'lodash'

function Buttons () {
  const dispatch = useDispatch()
  const spamOnPause = useSelector((state: StateType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: StateType) => state.spamerReducer.spamOnRun)

  return (
    <div className={s.buttons}>
      <div className={s.col}>
        <input
          disabled={spamOnPause || spamOnRun}
          id="uploadSpamAddresses"
          type="file"
          style={{ display: 'none' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const target = e.currentTarget as HTMLInputElement
            const file: File = (target.files as FileList)[0]
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = () => {
              if (reader.result && typeof reader.result === 'string') {
                const data = reader.result.split('\n').map(item => {
                  return (item && item.includes(':')) ? {
                    username: item.split(':')[0].trim(),
                    password: item.split(':')[1].trim()
                  } : ''
                })

                for (const item of data) {
                  if (item) {
                    const apps = ['android', 'iphone', 'ipad', 'windows', 'windowsPhone']
                    const app = apps[lodash.random(0, apps.length - 1)] as AuthAppType
                    dispatch(login(item.username, item.password, { app }))
                  }
                }
              }
            }
          }}
        />
        <label htmlFor="uploadSpamAddresses">
          <Button
            disabled={spamOnPause || spamOnRun}
            fullWidth
            variant="outlined"
            color="default"
            component="span"
            startIcon={<CloudUploadIcon/>}
          >
            Загрузить из файла
          </Button>
        </label>
        <Button
          fullWidth
          disabled={spamOnPause || spamOnRun}
          variant="outlined"
          startIcon={<ShuffleIcon/>}
          onClick={() => { dispatch(shuffleAccounts()) }}
        >
          Перемешать аккаунты
        </Button>
      </div>

      <div className={s.col}>
        <Button
          fullWidth
          disabled={spamOnPause || spamOnRun}
          variant="outlined"
          startIcon={<AddCircleIcon/>}
          onClick={() => { dispatch(setIsEnabledAll(true)) }}
        >
          Включить все аккаунты
        </Button>
        <Button
          fullWidth
          disabled={spamOnPause || spamOnRun}
          variant="outlined"
          startIcon={<RemoveCircleIcon/>}
          onClick={() => { dispatch(setIsEnabledAll(false)) }}
        >
          Выключить все аккаунты
        </Button>
      </div>

      <div className={s.col}>
        <Button
          fullWidth
          disabled={spamOnPause || spamOnRun}
          variant="outlined"
          startIcon={<DeleteIcon/>}
          onClick={() => {
            localStorage.removeItem('accounts')
            dispatch(clearAccounts())
          }}
        >
          Удалить все аккаунты
        </Button>
        <Button
          fullWidth
          disabled={spamOnPause || spamOnRun}
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
