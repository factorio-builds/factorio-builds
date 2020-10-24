import { createGlobalStyle } from "styled-components"
import { COLOR } from "../design/tokens/color"

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${COLOR.BACKGROUND};
    color: ${COLOR.PURPLE900};
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  body,
  #__next {
    min-height: 100vh;
  }

  #__next {
    display: flex;
    flex-direction: column;
  }
`
