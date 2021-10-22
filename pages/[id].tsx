import { GetStaticPaths, GetStaticProps } from "next";
import Hello from "../src/components/Hello";

export default function Home(
  props: ReturnType<typeof getServerSideProps>["props"]
) {
  return <Hello {...props} />;
}

export const getServerSideProps = ({ params: { id } }) => ({
  props: { id },
});

//export const getStaticPaths: GetStaticPaths = async () => ({
//   paths: [{ params: { id: "world" } }],
//   fallback: "blocking",
// });
