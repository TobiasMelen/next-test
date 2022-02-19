import { NextApiHandler } from "next";

const preview: NextApiHandler = async (req, res) => {
  const { slug, disable } = req.query;
  res[disable ? "clearPreviewData" : "setPreviewData"]({});
  res.redirect(typeof slug === "string" ? slug : "/");
};

export default preview;
