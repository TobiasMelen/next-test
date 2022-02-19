import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import ContentfulImage from "../components/ContentfulImage";
import {
  ContentfulArticle,
  createContentfulClient,
  imageProps,
  ImageProps,
} from "../contentful";
import css from "../styles/main.module.css";
import Article from "./[slug]";

type Props = {
  title: string;
  articles: {
    title: string;
    image?: ImageProps;
    slug: string;
    text?: string;
  }[];
};

export default function Home({ articles }: Props) {
  return (
    <main className={css.main}>
      <ul>
        {articles.map((article) => (
          <li
            style={{
              listStyle: "none",
              margin: "2em 0",
              paddingBottom: "2em",
            }}
          >
            <Link href={`/${article.slug}`}>
              <a>
                <Article {...article} />
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps<Props, {}> = async () => {
  const client = createContentfulClient(false);
  const articles = await client.getEntries<ContentfulArticle>({
    content_type: "article",
    order: "sys.createdAt",
  });
  const props: Props = {
    title: "My favourite animals",
    articles: articles.items?.map((article) => ({
      title: article.fields.title,
      text: article.fields.text?.split(/\r?\n/)[0],
      image: imageProps(article.fields.image),
      slug: article.fields.slug,
    })),
  };
  return { props };
};
