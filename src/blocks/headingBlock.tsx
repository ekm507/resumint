import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";

export function HeadingEditor({ block, update }: any) {
  const { text = "", level = 2, align = "left" } = block.props || {};

  const setProp = (key: string, value: any) => {
    update({
      ...block,
      props: { ...block.props, [key]: value },
    });
  };

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
        <option value="left">left</option>
        <option value="center">center</option>
        <option value="right">right</option>
      </select>
    </div>
  );
}

export function HeadingRender({ block }: any) {
  const { text, level = 2, align = "left" } = block.props || {};
  const Tag = `h${level}` as any;

  return (
    <Tag
      className={`heading-block heading-level-${level} heading-align-${align}`}
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
        align: "left",
      },
    };
  },

  Editor: HeadingEditor,
  Render: HeadingRender,
});
