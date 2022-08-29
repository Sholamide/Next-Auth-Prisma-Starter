import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider as AuthProvider } from 'next-auth/react'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session} refetchInterval={0}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
