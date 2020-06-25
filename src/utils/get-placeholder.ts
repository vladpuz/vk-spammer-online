import { SpamModeType } from '../types/types'

// Получение плейсхолдера для списка адресатов в зависимости от режима рассылки
const getPlaceholder = (mode: SpamModeType): string => {
  switch (mode) {
    case 'pm':
      return 'vanya_101\nid497257108\nkseniya2015\nи т.д.'
    case 'chat':
      return '345\n101\n239\nи т.д.'
    case 'chatAutoExit':
      return '345\n101\n239\nи т.д.'
    case 'usersWalls':
      return '115858632\n247829289\n27788181\nи т.д.'
    case 'groupsWalls':
      return '115755632\n248849289\n25818121\nи т.д.'
    case 'comments':
      return '157489262_420\n-227257809_3255\n297529259_1203\nи т.д.'
    case 'discussions':
      return '82514921_14544220\n84625170_24736522\n75625033_34796850\nи т.д.'
  }
}

export default getPlaceholder
