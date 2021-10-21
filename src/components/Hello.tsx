import { CSSProperties } from "react";

const containerStyle: CSSProperties = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "black",
};
const headingStyle: CSSProperties = {
  fontFamily: "system-ui",
  fontWeight: 900,
  textTransform: "uppercase",
  fontSize: "10em",
  textAlign: "center",
  background: "linear-gradient(yellow, red)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

type Props = {
  id: string;
}

export default function Hello(
  props: Props
) {
  return (
    <>
      <head>
        <title>Next.js</title>
      </head>
      <main style={containerStyle}>
        <h1 style={headingStyle}>Hello {props.id ?? "Next.js"}</h1>
      </main>
    </>
  );
}