import React from 'react'
import Title from '../../../../common/Title/Title'
import { MenuItem } from '@material-ui/core'
import MyTextField from '../../../../common/MyTextField'
import { SpamModeType } from '../../../../../types/types'
import { useFormikContext } from 'formik'
import { useSelector } from 'react-redux'
import { StateType } from '../../../../../redux/store'
import storage from 'store2'
import getPlaceholder from '../../../../../utils/get-placeholder'

type Props = {
  setPlaceholder: (placeholder: string) => void
}

function Select ({ setPlaceholder }: Props) {
  const { setFieldValue } = useFormikContext()
  const spamOnPause = useSelector((state: StateType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: StateType) => state.spamerReducer.spamOnRun)

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

          const fields = storage.local.get('fields')
          storage.local.set('fields', {
            ...fields,
            spamMode: spamMode
          })

          setPlaceholder(getPlaceholder(spamMode as SpamModeType))
          setFieldValue('addresses', storage.get('fields')?.addresses)
        }}
      >
        <MenuItem value={'pm'}>Личные сообщения <span role="img" aria-label="pm">👨</span></MenuItem>,
        <MenuItem value={'chat'}>Беседы <span role="img" aria-label="talks">👪</span></MenuItem>,
        <MenuItem value={'chatAutoExit'}>Беседы с автовыходом <span role="img" aria-label="talks">⛔</span></MenuItem>,
        <MenuItem value={'usersWalls'}>Стены юзеров <span role="img" aria-label="usersWalls">📄</span></MenuItem>,
        <MenuItem value={'groupsWalls'}>Стены групп <span role="img" aria-label="groupsWalls">📢</span></MenuItem>,
        <MenuItem value={'comments'}>Комментарии <span role="img" aria-label="comments">🖊</span></MenuItem>,
        <MenuItem value={'discussions'}>Обсуждения <span role="img" aria-label="discussions">🤓</span></MenuItem>
      </MyTextField>
    </>
  )
}

export default Select
