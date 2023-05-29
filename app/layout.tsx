import './globals.css'
import { Inter } from 'next/font/google'
import ToastContext from './context/ToasterContext'
import AuthContext from './context/AuthContext'
import ActiveStatus from './components/ActiveStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Messager Clone',
  description: 'Messager Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ActiveStatus />
          {children}
          <ToastContext />
        </AuthContext>
      </body>
    </html>
  )
}
