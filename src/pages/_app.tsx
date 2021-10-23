import "../styles/globals.css";

type Props = {
  Component: React.ComponentType<any>;
  pageProps: { title?: string };
};

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <head>
        <title>{pageProps.title}</title>
      </head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
