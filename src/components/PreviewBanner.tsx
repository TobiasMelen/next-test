import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function PreviewBanner() {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const [eventSource, setEventSource] = useState<EventSource>();
  useEffect(() => {
    setEventSource(
      new EventSource(
        "https://signaling-server.tobbes.site/sse/animal-favorites"
      )
    );
    return () => eventSource?.close();
  }, []);
  useEffect(() => {
    if (!eventSource) {
      return;
    }
    const refresh = (ev: Event) => {
      console.log(ev);
      router.replace(router.asPath);
    };
    eventSource.addEventListener("message", refresh);
    return () => {
      eventSource.removeEventListener("message", refresh);
    };
  }, [router, eventSource]);
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
