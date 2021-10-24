import "../styles/globals.css";

type Props = {
  Component: React.ComponentType<any>;
  pageProps: { title?: string };
};

const productionPublish = process.env.VERCEL_ENV === "production";

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <head>
        <title>{pageProps.title}</title>
        {productionPublish && (
          <>
            <script
              defer
              data-domain="next-test-one-wheat.vercel.app"
              src="https://plausible.io/js/plausible.js"
            ></script>
            <script>
              window.plausible = window.plausible || function()
              {(window.plausible.q = window.plausible.q || []).push(arguments)}
            </script>
          </>
        )}
      </head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
