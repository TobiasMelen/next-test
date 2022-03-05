import { css } from "goober";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  ContentfulArticle,
  createContentfulClient,
  imageProps,
  ImageProps,
} from "../contentful";
import Screen from "../components/Screen";

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
  const [currentScreen, setCurrentScreen] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  //Keep track of focused screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (e) => {
        const intersectingScreen = e
          .find((entry) => entry.isIntersecting)
          ?.target.getAttribute("data-screen");
        intersectingScreen && setCurrentScreen(intersectingScreen);
      },
      { threshold: 0.5, root: listRef.current, rootMargin: "50% 0% -50% 0%" }
    );
    const children = listRef.current?.querySelectorAll("[data-screen]") ?? [];
    children.forEach(observer?.observe.bind(observer));
    return () => {
      children.forEach(observer?.unobserve.bind(observer));
    };
  }, [articles]);

  //Loop scrolling
  useEffect(() => {
    const observer = new IntersectionObserver((e) => {
      console.log(e);
      const marker = e
        .find((entry) => entry.isIntersecting)
        ?.target.getAttribute("data-scrollmarker");
      switch (marker) {
        case "top":
          listRef.current
            ?.querySelectorAll(
              `[data-screen="${articles[articles.length - 1]?.slug}"]`
            )?.[1]
            .scrollIntoView();
          break;
        case "bottom": {
          listRef.current
            ?.querySelectorAll(`[data-screen="${articles[0]?.slug}"]`)?.[0]
            .scrollIntoView();
          break;
        }
      }
    });
    listRef.current
      ?.querySelectorAll("[data-scrollmarker]")
      .forEach(observer.observe.bind(observer));
    return () => observer.disconnect();
  }, [articles]);

  //Scroll to "first" real article on load
  useEffect(() => {
    const [firstArticle] = articles;
    firstArticle &&
      listRef.current &&
      listRef.current
        .querySelector(`[data-screen="${firstArticle.slug}"]`)
        ?.scrollIntoView();
  }, [articles]);

  return (
    <main
      ref={listRef}
      className={css`
        padding: 0;
        margin: 0;
        width: 100vw;
        height: 100vh;
        max-height: -webkit-fill-available;
        overflow-x: auto;
        scroll-snap-type: y mandatory;
        scrollbar-width: none;
        scroll-behavior: smooth;
        &::-webkit-scrollbar {
          -webkit-appearance: none;
          width: 0;
          height: 0;
        }
      `}
    >
      <div
        className={css`
          position: absolute;
          right: 0;
          padding: 2vmin;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 1;
          overscroll-behavior-block: contain;
        `}
      >
        {articles.map(({ slug }, index) => (
          <a
            key={slug + index}
            className={css`
              margin: 2vmin 0;
              padding: 0.6vmin;
              border: black 0.3vmin solid;
              border-radius: 50%;
              transition: background-color 300ms, transform 300ms;
              background-color: ${currentScreen === slug
                ? index % 2
                  ? "hotpink"
                  : "deepskyblue"
                : `transparent`};
              transform: scale(${currentScreen === slug ? "1.4" : "1"});
              transition-timing-function: ${currentScreen === slug
                ? "ease-in"
                : "ease-out"};
            `}
            onClick={() =>
              listRef.current
                ?.querySelector(`[data-screen="${slug}"]`)
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        ))}
      </div>
      <div style={{ height: 0 }} data-scrollmarker={"top"} />
      {[articles[articles.length - 1]]
        .concat(articles)
        .concat(articles[0])
        .map((article, index) => (
          <Screen
            article={article}
            key={`${article.slug}/${index}`}
            current={article.slug === currentScreen}
            color={index % 2 === 0 ? "hotpink" : "deepskyblue"}
          />
        ))}
      <div style={{ height: 0 }} data-scrollmarker={"bottom"} />
    </main>
  );
}

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
