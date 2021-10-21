import { GetStaticPaths, GetStaticProps } from "next";
import { CSSProperties } from "react";
import Hello from "../src/components/Hello";

export default function Home(
  props: ReturnType<typeof getStaticProps>["props"]
) {
  return <Hello {...props} />;
}

export const getStaticProps = ({ params: { id } }) => ({
  props: { id },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{ params: { id: "world" } }],
  fallback: "blocking",
});
