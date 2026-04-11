import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";
import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";

export function DividerEditor({ block, update }: any) {
  const { style = "solid", spacing = "md" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });
  return (
    <div className="divider-block-editor">
      <AdvancedOptions block={block} update={update}>
        <div className="options-grid">
          <div className="advanced-group">
            <label>style</label>
            <ToggleButton
              value={style}
              onChange={(v) => setProp("style", v)}
              options={[
                { value: "solid", label: "solid" },
                { value: "dashed", label: "dashed" },
                { value: "dotted", label: "dotted" },
              ]}
            />
          </div>

          <div className="advanced-group">
            <label>spacing</label>
            <ToggleButton
              value={spacing}
              onChange={(v) => setProp("spacing", v)}
              options={[
                { value: "sm", label: "small" },
                { value: "md", label: "medium" },
                { value: "lg", label: "large" },
              ]}
            />
          </div>
        </div>
      </AdvancedOptions>
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
