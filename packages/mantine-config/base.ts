import { createTheme } from '@mantine/core'
import { UITextInput } from './components'

export const theme = createTheme({
  defaultRadius: 'sm',
  colors: {
    blue: [
      '#e2f8ff',
      '#ccecff',
      '#9ed5fd',
      '#6abdf8',
      '#40a9f5',
      '#239df4',
      '#0896f4',
      '#0082db',
      '#0074c4',
      '#0065af',
    ],
  },
  components: {
    TextInput: UITextInput,
  },
})
