import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function LinkEditor({ block, update }: any) {
  const { text = "", url = "", target = "_self" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });
  return (
    <div className="link-block-editor">
      <input
        className="link-block-text-input"
        value={text}
        onChange={(e) => setProp("text", e.target.value)}
      />

      <input
        className="link-block-url-input"
        value={url}
        onChange={(e) => setProp("url", e.target.value)}
      />
    </div>
  );
}

export function LinkRender({ block }: any) {
  const { text, url, target } = block.props || {};

  return (
    <a className="link-block" href={url} target={target}>
      {text}
    </a>
  );
}

registerBlock({
  type: "link",
  label: "Link",

  create(): Block {
    return {
      id: "",
      blockType: "link",
      props: {
        text: "",
        url: "",
        target: "_self",
      },
    };
  },

  Editor: LinkEditor,
  Render: LinkRender,
});
