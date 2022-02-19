import { Asset, createClient } from "contentful";
import { requiredEnvVar, throwInlineError } from "./utils";

export type ContentfulArticle = {
  title: string;
  text?: string;
  image?: Asset;
  slug: string;
};

export const createContentfulClient = (preview = false) => {
  const space = requiredEnvVar("CONTENTFUL_SPACE");
  const accessToken = preview
    ? requiredEnvVar("CONTENTFUL_PREVIEW_TOKEN")
    : requiredEnvVar("CONTENTFUL_TOKEN");
  return createClient({ space, accessToken });
};

export type ImageProps = ReturnType<typeof imageProps>;
export const imageProps = <TAsset extends Asset>(asset?: TAsset) => {
  const url = asset?.fields.file?.url?.substr(1);
  return {
    height: asset?.fields.file.details.image?.height,
    width: asset?.fields.file.details.image?.width,
    src: `https:/${url}`,
    alt: asset?.fields.title ?? "",
  };
};
