import { GetStaticProps } from "next";
import Link from "next/link";
import {
  ContentfulArticle,
  createContentfulClient,
  imageProps,
  ImageProps,
} from "../contentful";
import css from "../styles/main.module.css";
import Image from "next/image";

type Props = {
  articles: { title: string; image?: ImageProps; slug: string }[];
};

export default function Home({ articles }: Props) {
  return (
    <main className={css.main}>
      <ul>
        {articles.map((article) => (
          <li style={{ listStyle: "none", fontSize: "2em" }}>
            <Link href={`/${article.slug}`}>
              <a
                onClick={() =>
                  window.plausible("ArticleView", { type: article.title })
                }
              >
                {article.image && (
                  <Image
                    {...article.image}
                    width={200}
                    height={200}
                    objectFit="cover"
                  />
                )}
                {article.title}
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
    order: "sys.updatedAt",
  });
  const props: Props = {
    articles: articles.items?.map((article) => ({
      title: article.fields.title,
      image: imageProps(article.fields.image),
      slug: article.fields.slug,
    })),
  };
  return { props };
};
