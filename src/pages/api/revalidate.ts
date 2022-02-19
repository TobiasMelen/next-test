import { NextApiHandler } from "next";
import { createContentfulClient, ContentfulArticle } from "../../contentful";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const revalidate: NextApiHandler = async (_, res) => {
  const contentfulClient = createContentfulClient();
  await Promise.all(
    [
      "/",
      ...(
        await contentfulClient.getEntries<ContentfulArticle>({
          content_type: "article",
        })
      ).items.map((s) => `/${s.fields.slug}`),
    ].map(res.unstable_revalidate.bind(res))
  );
  res.end();
};

export default revalidate;
