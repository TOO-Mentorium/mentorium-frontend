import '@mantine/core/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import './global.css'
import { Notifications } from '@mantine/notifications'
import { Ubuntu } from 'next/font/google'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { theme } from '@repo/mantine-config/base'

import '@mantine/dropzone/styles.css'
import '@mantine/tiptap/styles.css'

export const metadata = {
  title: 'Mentorium',
}

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

interface Props {
  children: React.ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <html className={ubuntu.className} lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="dark"
          theme={{ ...theme, fontFamily: ubuntu.style.fontFamily }}
        >
          <Notifications position="top-right" zIndex={2000} />

          {children}
        </MantineProvider>
      </body>
    </html>
  )
}

export default RootLayout
