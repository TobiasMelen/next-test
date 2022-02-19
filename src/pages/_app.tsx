import Head from "next/head";
import PreviewBanner from "../components/PreviewBanner";
import "../styles/globals.css";

type Props = {
  Component: React.ComponentType<any>;
  pageProps: { title?: string; preview?: boolean };
};

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <Head>
        <title>{pageProps.title}</title>
      </Head>
      <Component {...pageProps} />
      {pageProps.preview && <PreviewBanner />}
    </>
  );
}

export default MyApp;
