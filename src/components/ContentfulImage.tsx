import { Asset } from "contentful";
import { ComponentProps } from "react";

export default function ContentfulImage({...props }: ComponentProps<"img">) {
  return (
    <picture>
      <img {...props}/>
    </picture>
  );
}
