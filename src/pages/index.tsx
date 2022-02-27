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
              padding: 0.4vmin;
              background-color: black;
              border-radius: 50%;
              transition: box-shadow 500ms;
              box-shadow: ${currentScreen === slug
                ? `0 0 0 .9vmin deepskyblue`
                : `none`};
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
        .map((article, index) => {
          return (
            <Fragment key={article.slug + index}>
              <div
                data-screen={article.slug}
                className={css({
                  height: 0,
                  scrollSnapStop: "always",
                  scrollSnapAlign: "start",
                })}
              ></div>
              <Link href={`/${article.slug}`}>
                <a
                  className={css({
                    position: "sticky",
                    left: 0,
                    top: 0,
                    padding: 0,
                    margin: 0,
                    listStyle: "none",
                    height: "100%",
                    //maxHeight: "-webkit-fill-available",
                    width: "100%",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: `flex-${index % 2 === 0 ? "start" : "end"}`,
                    alignItems: "flex-end",
                    background: "#DDD",
                  })}
                >
                  <h2
                    className={css`
                      margin: 0.5em;
                      z-index: 2;
                      color: ${fontColors[index % fontColors.length]};
                      -webkit-text-stroke: 0.6vmin black;
                      font-size: 13vmin;
                      font-weight: 900;
                      text-transform: uppercase;
                      font-style: italic;
                      line-height: 1;
                      opacity: ${article.slug === currentScreen ? 1 : 0};
                      transform: translateX(
                        ${article.slug === currentScreen
                          ? "0"
                          : `${index % 2 === 0 ? "-" : ""}75%`}
                      );
                      transition: transform 350ms ease-out, opacity 350ms;
                      transition-delay: 175ms;
                      &::after {
                        content: "";
                        display: block;
                        border: 0.6vmin black solid;
                        background-color: ${fontColors[
                          index % fontColors.length
                        ]};
                        padding: 1vmin;
                        transform: skewX(-12deg);
                        width: 93%;
                        margin-left: -1vmin;
                      }
                    `}
                  >
                    {article.title}
                  </h2>
                  <Image
                    alt={article.title}
                    loading="eager"
                    quality="50"
                    layout="fill"
                    src={`${article.image?.src}`}
                    className={css({
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    })}
                  />
                </a>
              </Link>
            </Fragment>
          );
        })}
      <div style={{ height: 0 }} data-scrollmarker={"bottom"} />
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
