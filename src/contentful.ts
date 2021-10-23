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
  return createClient({space, accessToken});
};
