import React from 'react'
import Title from '../../../../common/Title/Title'
import { MenuItem } from '@material-ui/core'
import MyTextField from '../../../../common/MyTextField'
import bs from '../../../../../utils/BrowserStorage'
import addresses from '../../../../../utils/addresses'
import { SpamModeType } from '../../../../../types/types'
import { useFormikContext } from 'formik'
import { useSelector } from 'react-redux'
import { RootReducerType } from '../../../../../redux/store'

interface IProps {
  setPlaceholder: (placeholder: string) => void
}

function Select ({ setPlaceholder }: IProps) {
  const { setFieldValue } = useFormikContext()
  const spamOnPause = useSelector((state: RootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: RootReducerType) => state.spamerReducer.spamOnRun)

  return (
    <>
      <Title>Режим рассылки</Title>
      <MyTextField
        disabled={spamOnPause || spamOnRun}
        name="spamMode"
        fullWidth
        select
        variant="outlined"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const spamMode = e.target.value as SpamModeType

          bs.local.set('fields.spamMode', spamMode)
          setPlaceholder(addresses.getPlaceholder(spamMode as SpamModeType))
          setFieldValue('addressees', addresses.getLocalValue(spamMode) || '')
        }}
      >
        <MenuItem value={'pm'}>Личные сообщения <span role="img" aria-label="pm">👨</span></MenuItem>,
        <MenuItem value={'talks'}>Беседы <span role="img" aria-label="talks">👪</span></MenuItem>,
        <MenuItem value={'talksAutoExit'}>Беседы с автовыходом <span role="img" aria-label="talks">⛔</span></MenuItem>,
        <MenuItem value={'usersWalls'}>Стены юзеров <span role="img" aria-label="usersWalls">📄</span></MenuItem>,
        <MenuItem value={'groupsWalls'}>Стены групп <span role="img" aria-label="groupsWalls">📢</span></MenuItem>,
        <MenuItem value={'comments'}>Комментарии <span role="img" aria-label="comments">🖊</span></MenuItem>,
        <MenuItem value={'discussions'}>Обсуждения <span role="img" aria-label="discussions">🤓</span></MenuItem>
      </MyTextField>
    </>
  )
}

export default Select
