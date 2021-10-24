import { GetStaticPaths, GetStaticProps } from "next";
import { ContentfulArticle, createContentfulClient } from "../contentful";

type Props = {
  title: string;
  image?: string;
  text?: string;
};

export default function Home(props: Props) {
  return <main>{props.title}</main>;
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
      image: article.image?.fields.file.url,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ["/owls"],
  fallback: true,
});
