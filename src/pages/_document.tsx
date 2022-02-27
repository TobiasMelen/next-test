import { Html, Head, Main, NextScript } from "next/document";
import { extractCss } from "goober";

export default function Document({ css } = { css: "" }) {
  <Html>
    <Head>
      <style
        id={"_goober"}
        // And defined it in here
        dangerouslySetInnerHTML={{ __html: " " + css }}
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>;
}

export function getInitialProps({ renderPage }: any) {
  const page = renderPage();
  const css = extractCss(page);
  return { ...page, css };
}
