import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";

export function TextEditor({ block, update }: any) {
  return (
    <input
      value={block.props.text || ""}
      onChange={(e) =>
        update({
          ...block,
          props: { ...block.props, text: e.target.value },
        })
      }
    />
  );
}

export function TextRender({ block }: any) {
  return <p>{block.props.text}</p>;
}

registerBlock({
  type: "text",
  label: "Text",

  create(): Block {
    return {
      id: "",
      blockType: "text",
      props: { text: "" },
    };
  },

  Editor: TextEditor,
  Render: TextRender,
});
