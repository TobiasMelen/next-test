import { GetStaticPaths, GetStaticProps } from "next";
import {
  ContentfulArticle,
  createContentfulClient,
  ImageProps,
  imageProps,
} from "../contentful";
import css from "../styles/main.module.css";

type Props = {
  title: string;
  image?: ImageProps;
  text?: string;
};

export default function Article(props: Props) {
  return (
    <article style={{ marginBottom: "2em" }}>
      {props.image && (
        <img
          {...props.image}
          src={props.image.src + "?fm=avif&w=1600"}
          style={{
            display: "block",
            height: "50vh",
            width: "900px",
            objectFit: "cover",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        />
      )}
      <section className={css.textBlock}>
        <h2 className={css.heading}>{props.title}</h2>
        <p>{props.text}</p>
      </section>
    </article>
  );
}

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async ({
  params: { slug } = {},
}) => {
  const client = createContentfulClient(false);
  const article =
    slug != null &&
    (
      await client.getEntries<ContentfulArticle>({
        content_type: "article",
        "fields.slug": slug,
      })
    )?.items?.[0]?.fields;
  if (!article) {
    return { notFound: true };
  }
  return {
    props: {
      title: article.title,
      text: article.text,
      image: imageProps(article.image),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});
