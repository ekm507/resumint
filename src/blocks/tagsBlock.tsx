import AdvancedOptions from "../components/AdvancedOptions";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function TagsEditor({ block, update }: any) {
  const {
    items = [],
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
    const copy = [...items];
    copy[i] = val;
    setProp("items", copy);
  };

  return (
    <div className="tags-block-editor">
      <div className="tags-list">
        {items.map((tag: string, i: number) => (
          <div key={i} className="tag-input-row">
            <input
              value={tag}
              onChange={(e) => updateItem(i, e.target.value)}
            />
            <button
              onClick={() =>
                setProp(
                  "items",
                  items.filter((_: any, idx: number) => idx !== i),
                )
              }
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={() => setProp("items", [...items, ""])}>
          + Add Tag
        </button>
      </div>

      <AdvancedOptions block={block} update={update}>
        <div className="advanced-group">
          <label>Shape</label>
          <select
            value={shape}
            onChange={(e) => setProp("shape", e.target.value)}
          >
            <option value="pill">Pill</option>
            <option value="rounded">Rounded</option>
            <option value="square">Square</option>
          </select>
        </div>

        <div className="advanced-group">
          <label>Size</label>
          <select
            value={size}
            onChange={(e) => setProp("size", e.target.value)}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        <div className="advanced-group">
          <label>Style</label>
          <select
            value={variant}
            onChange={(e) => setProp("variant", e.target.value)}
          >
            <option value="filled">Filled Background</option>
            <option value="outline">Outline Only</option>
          </select>
        </div>
      </AdvancedOptions>
    </div>
  );
}

export function TagsRender({ block }: any) {
  const {
    items = [],
    shape = "pill",
    size = "md",
    variant = "filled",
  } = block.props || {};
  return (
    <div className={`tags-block align-start`}>
      {items.map((tag: string, i: number) => (
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
        items: [""],
        shape: "pill",
        size: "md",
        variant: "filled",
      },
    };
  },

  Editor: TagsEditor,
  Render: TagsRender,
});
