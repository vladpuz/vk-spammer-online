import React from 'react'
import s from './Buttons.module.css'
import Button from '@material-ui/core/Button'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import ClearIcon from '@material-ui/icons/Clear'
import { Box } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { addLogItem, clearLog } from '../../../../../../redux/ducks/spamer/action-creators'
import { StateType } from '../../../../../../redux/store'
import ResumeButton from './ResumeButton'
import PauseButton from './PauseButton'
import { useFormikContext } from 'formik'
import stop from '../../../../../../redux/thunks/spam/stop/stop'

function Buttons () {
  const buttonWidth = 200
  const spamIsRun = useSelector((state: StateType) => state.spamerReducer.spamOnRun)
  const spamOnPause = useSelector((state: StateType) => state.spamerReducer.spamOnPause)
  const dispatch = useDispatch()
  const { values }: { values: any } = useFormikContext()

  return (
    <div className={s.buttons}>
      <Box width={buttonWidth}>
        {
          spamIsRun ? (
            spamOnPause ? <ResumeButton/> : <PauseButton/>
          ) : (
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon/>}
            >
              Начать спам
            </Button>
          )
        }
      </Box>

      <Box width={buttonWidth}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<StopIcon/>}
          disabled={!spamIsRun}
          onClick={() => {
            dispatch(
              stop(
                addLogItem('Рассылка прекращена', 'info', `Рассылка прекращена - ${Date.now()}`),
                values.autoSwitchTime
              )
            )
          }}
        >
          Прервать спам
        </Button>
      </Box>

      <Box width={buttonWidth}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<ClearIcon/>}
          onClick={() => { dispatch(clearLog()) }}
        >
          Очистить лог
        </Button>
      </Box>
    </div>
  )
}

export default Buttons
