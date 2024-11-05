import { AppProps } from "next/app"

import "styles/globals.css"
import "styles/articles.css"
import { MenuProvider } from "components/menu-context"

export default function App({ Component, pageProps }: AppProps) {
  return (
     <MenuProvider>
      <Component {...pageProps} />
    </MenuProvider>
  )
}
