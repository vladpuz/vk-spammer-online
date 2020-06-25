import pause from '../pause/pause'
import { addLogItem, setAutoPauseTimerId } from '../../../ducks/spamer/action-creators'
import { ThunkType } from '../../../store'
import { SpamValuesType } from '../../../../types/types'

// Устанавливаем таймер автопаузы
const setAutoPauseTimer = (spamValues: SpamValuesType): ThunkType => {
  return async (dispatch) => {
    if (spamValues.autoPauseTimeout) {
      const autoPauseTimerId = window.setTimeout(async () => {
        await dispatch(pause(
          addLogItem('Сработала автопауза', 'info', `Сработала автопауза - ${Date.now()}`),
          spamValues.autoSwitchTime
        ))
      }, spamValues.autoPauseTimeout * 60 * 1000)

      dispatch(setAutoPauseTimerId(autoPauseTimerId))
    }
  }
}

export default setAutoPauseTimer
