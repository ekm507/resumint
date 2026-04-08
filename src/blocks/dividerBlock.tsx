import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function DividerEditor({ block, update }: any) {
  const { style = "solid", spacing = "md" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({ ...block, props: { ...block.props, [k]: v } });

  return (
    <div className="divider-block-editor">
      <select
        className="divider-block-style-select"
        value={style}
        onChange={(e) => setProp("style", e.target.value)}
      >
        <option value="solid">solid</option>
        <option value="dashed">dashed</option>
        <option value="dotted">dotted</option>
      </select>

      <select
        className="divider-block-spacing-select"
        value={spacing}
        onChange={(e) => setProp("spacing", e.target.value)}
      >
        <option value="sm">small</option>
        <option value="md">medium</option>
        <option value="lg">large</option>
      </select>
    </div>
  );
}

export function DividerRender({ block }: any) {
  const { style = "solid", spacing = "md" } = block.props || {};

  return (
    <hr
      className={`divider-block divider-style-${style} divider-spacing-${spacing}`}
    />
  );
}

registerBlock({
  type: "divider",
  label: "Divider",

  create(): Block {
    return {
      id: "",
      blockType: "divider",
      props: {
        style: "solid",
        spacing: "md",
      },
    };
  },

  Editor: DividerEditor,
  Render: DividerRender,
});
