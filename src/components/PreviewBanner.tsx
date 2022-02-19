import { useState } from "react";

export default function PreviewBanner() {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() =>
        (window.location.href = `/api/preview?disable=true&slug=${window.location.pathname}`)
      }
      style={{
        background: "red",
        color: "white",
        width: 150,
        position: "fixed",
        top: "20px",
        left: "-40px",
        transform: "rotate(-45deg)",
        cursor: "pointer",
        textAlign: "center",
        padding: "0.5em",
        zIndex: 10000,
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      {hover ? "Back?" : "Preview"}
    </div>
  );
}
