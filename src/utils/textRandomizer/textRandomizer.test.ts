import textRandomizer from './textRandomizer'

describe('textRandomizer', () => {
  test('Текст рандомизируется с пробелами', () => {
    const text = 'Hello, [[ value1 | value2 ]]'
    const result = textRandomizer(text)
    expect(result === 'Hello, value1' || result === 'Hello, value2').toBeTruthy()
  })

  test('Текст рандомизируется без пробелов', () => {
    const text = 'Hello, [[value1|value2]]'
    const result = textRandomizer(text)
    expect(result === 'Hello, value1' || result === 'Hello, value2').toBeTruthy()
  })

  test('Текст рандомизируется с переносами строк', () => {
    const text = 'Hello, [[\nvalue1\n|\nvalue2\n]]'
    const result = textRandomizer(text)
    expect(result === 'Hello, value1' || result === 'Hello, value2').toBeTruthy()
  })
})
