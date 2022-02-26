import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import ContentfulImage from "../components/ContentfulImage";
import {
  ContentfulArticle,
  createContentfulClient,
  imageProps,
  ImageProps,
} from "../contentful";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    const children = listRef.current.querySelectorAll("[data-screen]");
    console.log(children);
    const observer = new IntersectionObserver(
      (e) => {
        const intersectingIndex = e
          .find((entry) => entry.isIntersecting)
          ?.target.getAttribute("data-screen");
        console.log(...e);
        setCurrentIndex((index) =>
          typeof intersectingIndex === "string"
            ? parseInt(intersectingIndex)
            : index - 1
        );
      },
      { threshold: 0.5, root: listRef.current, rootMargin: "-10%" }
    );
    children.forEach(observer.observe.bind(observer));
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <main
      ref={listRef}
      style={{
        padding: 0,
        margin: 0,
        width: "100vw",
        height: "100vh",
        overflowX: "auto",
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <h2 style={{ color: "white" }}>{currentIndex}</h2>
      </div>
      {articles.map((article, index) => (
        <Fragment key={article.slug}>
          <div
            style={{
              height: 0,
              scrollSnapStop: "always",
              scrollSnapAlign: "start",
            }}
          ></div>
          <div
            data-screen={index}
            style={{
              position: "sticky",
              left: 0,
              top: 0,
              //zIndex: index + 1,
              padding: 0,
              margin: 0,
              listStyle: "none",
              height: "100vh",
              width: "100vw",
              flexShrink: 0,
              // scrollSnapAlign: "center",
              // scrollSnapStop: "always",
            }}
          >
            <Link href={`/${article.slug}`}>
              <a
                style={{
                  display: "flex",
                  justifyContent: `flex-${index % 2 === 0 ? "start" : "end"}`,
                  alignItems: "flex-end",
                  width: "100%",
                  height: "100%",
                }}
              >
                <h2
                  style={{
                    margin: "0.25em",
                    zIndex: 2,
                    color: fontColors[index % fontColors.length],
                    WebkitTextStroke: ".6vmin black",
                    fontSize: "13vmin",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontStyle: "italic",
                    letterSpacing: 1.1,
                  }}
                >
                  {article.title}
                </h2>
                <img
                  {...article.image}
                  src={`${article.image?.src}?fm=webp&w=1500`}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </a>
            </Link>
          </div>
        </Fragment>
      ))}
    </main>
  );
}

const fontColors = ["hotpink", "DeepSkyBlue"];

export const getStaticProps: GetStaticProps<Props, {}> = async ({
  preview = false,
}) => {
  return {
    props: {
      preview,
      title: "My favourite animals",
      articles: await getContentfulArticles(preview),
    },
  };
};

const getContentfulArticles = async (preview: boolean) => {
  const client = createContentfulClient(preview);
  const articles = await client.getEntries<ContentfulArticle>({
    content_type: "article",
    order: "-sys.updatedAt",
  });
  return articles.items?.map((article) => ({
    title: article.fields.title,
    text: article.fields.text?.split(/\r?\n/)[0],
    image: imageProps(article.fields.image),
    slug: article.fields.slug,
  }));
};
