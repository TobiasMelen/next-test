// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function revalidate(req, res) {
  await res.unstable_revalidate("*");
}
