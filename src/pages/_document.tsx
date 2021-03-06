import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { extractCss } from "goober";

export default class MyDocument extends Document<{ css: string }> {
  static async getInitialProps({ renderPage }: DocumentContext) {
    const page = renderPage();

    // Extrach the css for each page render
    const css = extractCss();
    return { ...page, css };
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            id={"_goober"}
            // And defined it in here
            dangerouslySetInnerHTML={{ __html: " " + this.props.css }}
          />
        </Head>
        <body>
          <Main />
          <script src="https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
