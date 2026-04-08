import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function ImageEditor({ block, update }: any) {
  const {
    src = "",
    alt = "",
    width = "100%",
    align = "center",
  } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  return (
    <div className="image-block-editor">
      <input
        className="image-block-src-input"
        placeholder="image url"
        value={src}
        onChange={(e) => setProp("src", e.target.value)}
      />

      <input
        className="image-block-alt-input"
        placeholder="alt"
        value={alt}
        onChange={(e) => setProp("alt", e.target.value)}
      />

      <input
        className="image-block-width-input"
        value={width}
        onChange={(e) => setProp("width", e.target.value)}
      />
    </div>
  );
}

export function ImageRender({ block }: any) {
  const { src, alt, width = "100%", align = "center" } = block.props || {};

  return (
    <div className={`image-block image-align-${align}`}>
      <img className="image-block-img" src={src} alt={alt} style={{ width }} />
    </div>
  );
}

registerBlock({
  type: "image",
  label: "Image",

  create(): Block {
    return {
      id: "",
      blockType: "image",
      props: {
        src: "https://",
        alt: "",
        width: "100%",
        align: "center",
      },
    };
  },

  Editor: ImageEditor,
  Render: ImageRender,
});
