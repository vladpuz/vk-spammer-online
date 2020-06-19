import React from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { StateType } from '../../../../../../redux/store'
import s from './AddButton.module.css'

function AddButton () {
  const authInProgress = useSelector((state: StateType) => state.accountsReducer.authWorkflow.authInProgress)

  return (
    <div className={s.button}>
      <Button fullWidth disabled={authInProgress} type="submit" variant="contained" color="primary">
        Добавить
      </Button>
      {
        authInProgress && (
          <div className={s.button__progress}>
            <CircularProgress size={30}/>
          </div>
        )
      }
    </div>
  )
}

export default AddButton
