import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";

export function TextEditor({ block, update }: any) {
  const { text = "", size = "md", align = "start" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  return (
    <div className="text-block-editor">
      <textarea
        className="text-block-input"
        value={text}
        onChange={(e) => setProp("text", e.target.value)}
      />

      <div className="text-block-controls">
        <select
          className="text-block-size-select"
          value={size}
          onChange={(e) => setProp("size", e.target.value)}
        >
          <option value="md">midsize</option>
          <option value="lg">big</option>
          <option value="xl">bigger</option>
        </select>

        <select
          className="text-block-align-select"
          value={align}
          onChange={(e) => setProp("align", e.target.value)}
        >
          <option value="start">start</option>
          <option value="center">center</option>
          <option value="end">end</option>
          <option value="justify">justify</option>
        </select>
      </div>
    </div>
  );
}

export function TextRender({ block }: any) {
  const { text, size = "md", align = "start" } = block.props || {};

  return (
    <p className={`text-block text-size-${size}`} style={{ textAlign: align }}>
      {text}
    </p>
  );
}

registerBlock({
  type: "text",
  label: "Text",

  create(): Block {
    return {
      id: "",
      blockType: "text",
      props: {
        text: "",
        size: "md",
        align: "start",
      },
    };
  },

  Editor: TextEditor,
  Render: TextRender,
});
