import Head from "next/head";
import "../styles/globals.css";

type Props = {
  Component: React.ComponentType<any>;
  pageProps: { title?: string };
};

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <Head>
        <title>{pageProps.title}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
