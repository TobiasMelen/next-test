import "../styles/globals.css";

type Props = {
  Component: React.ComponentType<any>;
  pageProps: { title?: string };
};

const url = process.env.VERCEL_URL;

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <head>
        <title>{pageProps.title}</title>
        {url && (
          <script
            defer
            data-domain={url}
            src="https://plausible.io/js/plausible.js"
          ></script>
        )}
      </head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
