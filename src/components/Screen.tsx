import { css } from "goober";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { ContentfulArticle, ImageProps } from "../contentful";
import Image from "next/image";

type Props = {
  article: {
    title: string;
    image?: ImageProps;
    slug: string;
    text?: string;
  };
  color: string;
  current: boolean;
};

export default function Screen({ article, color, current }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.animate(
      {
        transform: ["translateY(-40%)", "translateY(0%)"],
      },
      {
        duration: 1,
        fill: "both",
        //@ts-ignore
        timeline: new ScrollTimeline({
          source: document.querySelector("main"),
          scrollOffsets: [
            { target: ref.current, edge: "end", clamp: true },
            { target: ref.current, clamp: true, threshold: 1 },
          ],
          fill: "both",
        }),
      }
    );
  }, []);
  return (
    <Fragment>
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
            justifyContent: `flex-${color === "hotpink" ? "start" : "end"}`,
            alignItems: "flex-end",
            background: "#DDD",
            overflow: "hidden",
          })}
        >
          <h2
            className={css`
              margin: 0.5em;
              z-index: 2;
              color: ${color};
              -webkit-text-stroke: 0.6vmin black;
              font-size: 13vmin;
              font-weight: 900;
              text-transform: uppercase;
              font-style: italic;
              line-height: 1;
              opacity: ${current ? 1 : 0};
              transform: translateX(
                ${current ? "0" : `${color === "hotpink" ? "-" : ""}75%`}
              );
              transition: transform 350ms ease-out, opacity 350ms;
              transition-delay: 175ms;
              &::after {
                content: "";
                display: block;
                border: 0.6vmin black solid;
                background-color: ${color};
                padding: 1vmin;
                transform: skewX(-12deg);
                width: 93%;
                margin-left: -1vmin;
              }
            `}
          >
            {article.title}
          </h2>
          <div
            ref={ref}
            className={css`
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
            `}
          >
            <Image
              alt={article.title}
              loading="eager"
              quality="50s"
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
          </div>
        </a>
      </Link>
    </Fragment>
  );
}
