import { GetStaticProps } from "next";
import Link from "next/link";
import { ContentfulArticle, createContentfulClient } from "../contentful";
import css from "../styles/main.module.css";

type Props = {
  articles: { title: string; image?: string; slug: string }[];
};

export default function Home({ articles }: Props) {
  return (
    <main className={css.main}>
      <ul>
        {articles.map((article) => (
          <li>
            <Link href={`/${article.slug}`}>{article.title}</Link>
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
    order: "sys.updatedAt",
  });
  const props: Props = {
    articles: articles.items?.map((article) => ({
      title: article.fields.title,
      image: article.fields.image?.fields.file?.url,
      slug: article.fields.slug,
    })),
  };
  return { props };
};
