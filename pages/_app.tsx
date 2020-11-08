import type { AppProps } from "next/app"
import { ThemeProvider } from "styled-components"
import { wrapper } from "../redux/store"
import { GlobalStyle } from "../styles/global-style"
import { theme } from "../styles/theme"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default wrapper.withRedux(MyApp)
