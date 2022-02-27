import { AppInitialProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";
import "../styles/globals.css";

type Props = {
  Component: React.ComponentType<any>;
  pageProps: { title?: string; preview?: boolean };
};

const PreviewBanner = dynamic(() => import("../components/PreviewBanner"));

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <Head>
        <title>{pageProps.title}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐖</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      {pageProps.preview && <PreviewBanner />}
    </>
  );
}

export default MyApp;
