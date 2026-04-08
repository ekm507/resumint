import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";

export function HeadingEditor({ block, update }: any) {
  const { text = "", level = 2, align = "start" } = block.props || {};
  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });
  return (
    <div className="heading-block-editor">
      <input
        className="heading-block-input"
        value={text}
        onChange={(e) => setProp("text", e.target.value)}
      />

      <select
        className="heading-block-level-select"
        value={level}
        onChange={(e) => setProp("level", Number(e.target.value))}
      >
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
      </select>

      <select
        className="heading-block-align-select"
        value={align}
        onChange={(e) => setProp("align", e.target.value)}
      >
        <option value="start">start</option>
        <option value="center">center</option>
        <option value="end">end</option>
      </select>
    </div>
  );
}

export function HeadingRender({ block }: any) {
  const { text, level = 2, align = "left" } = block.props || {};
  const Tag = `h${level}` as any;

  return (
    <Tag
      className={`heading-block heading-level-${level}`}
      style={{ textAlign: align }}
    >
      {text}
    </Tag>
  );
}

registerBlock({
  type: "heading",
  label: "Heading",

  create(): Block {
    return {
      id: "",
      blockType: "heading",
      props: {
        text: "",
        level: 2,
        align: "start",
      },
    };
  },

  Editor: HeadingEditor,
  Render: HeadingRender,
});
