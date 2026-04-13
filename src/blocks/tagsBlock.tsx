import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function TagsEditor({ block, update }: any) {
  const {
    tags = [],
    shape = "pill", // pill, rounded, square
    size = "md", // sm, md, lg
    variant = "filled", // filled, outline
  } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const updateItem = (i: number, val: string) => {
    const copy = [...tags];
    copy[i] = val;
    setProp("tags", copy);
  };

  return (
    <div className="tags-block-editor">
      <div className="tags-list">
        {tags.map((tag: string, i: number) => (
          <div key={i} className="input-row">
            <input
              className="text-input"
              value={tag}
              onChange={(e) => updateItem(i, e.target.value)}
            />
            <button
              className="item-remove-button"
              onClick={() =>
                setProp(
                  "tags",
                  tags.filter((_: any, idx: number) => idx !== i),
                )
              }
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={() => setProp("tags", [...tags, ""])}>
          + Add Tag
        </button>
      </div>

      <AdvancedOptions block={block} update={update}>
        <div className="options-grid">
          <div className="option-group">
            <label>Shape</label>
            <ToggleButton
              value={shape}
              onChange={(v) => setProp("shape", v)}
              options={[
                { value: "pill", label: "Pill" },
                { value: "rounded", label: "Rounded" },
                { value: "square", label: "Square" },
              ]}
            />
          </div>
          <div className="option-group">
            <label>Size</label>
            <ToggleButton
              value={size}
              onChange={(v) => setProp("size", v)}
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
            />
          </div>

          <div className="option-group">
            <label>Style</label>

            <ToggleButton
              value={variant}
              onChange={(v) => setProp("variant", v)}
              options={[
                { value: "filled", label: "Filled Background" },
                { value: "outline", label: "Outline Only" },
              ]}
            />
          </div>
        </div>
      </AdvancedOptions>
    </div>
  );
}

export function TagsRender({ block }: any) {
  const {
    tags = [],
    shape = "pill",
    size = "md",
    variant = "filled",
  } = block.props || {};
  return (
    <div className={`tags-block align-start`}>
      {tags.map((tag: string, i: number) => (
        <span
          key={i}
          className={`tags-block-tag tag-shape-${shape} tag-size-${size} tag-variant-${variant}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

registerBlock({
  type: "tags",
  label: "Tags",

  create(): Block {
    return {
      id: "",
      blockType: "tags",
      props: {
        tags: [""],
        shape: "pill",
        size: "md",
        variant: "filled",
      },
    };
  },

  Editor: TagsEditor,
  Render: TagsRender,
});
