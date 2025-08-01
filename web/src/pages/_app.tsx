import '../styles/global.css'
import type { AppProps } from 'next/app'
// import { SessionProvider } from "next-auth/react"
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderLayoutByPath } from 'src/helpers/render-layout-by-path'
import { GlobalState } from 'src/components/GlobalState'
import { useState } from 'react'
import { CustomToaster } from 'src/components/CustomToaster'
import { CookiesPopup } from 'src/components/pages/shared/CookiesPopup'
import { LoadingScreen } from 'src/components/ui/LoadingScreen'
import { Analytics } from '@vercel/analytics/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      }
    }
  }))
  
  const isCatalogRoute = Object.keys(router?.components ?? {}).some(x => x.includes('/_sites/[site]'));

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        {/* <SessionProvider session={session}> */}
          <CustomToaster />
          <GlobalState isCatalogRoute={isCatalogRoute}>
            {renderLayoutByPath(router.pathname, <Component {...pageProps} />)}
            <Analytics
              debug={process.env.NODE_ENV === 'development'}
            />
          </GlobalState>
          {!isCatalogRoute && <LoadingScreen />}
          <CookiesPopup />
        {/* </SessionProvider> */}
      </Hydrate>
    </QueryClientProvider>
  )
}
