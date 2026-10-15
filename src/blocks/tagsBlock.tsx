import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function TagsEditor({ block, update }: any) {
  const {
    tags = [],
    shape = "pill",
    size = "md",
    variant = "filled",
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

  const tagClass = `tags-block-tag tag-shape-${shape} tag-size-${size} tag-variant-${variant}`;

  return (
    <div className="tags-block-editor">
      <div className="tags-block">
        {tags.map((tag: string, i: number) => (
          <span key={i} className={tagClass + " flex items-center gap-1"}>
            <input
              className="bg-transparent border-0 outline-none text-inherit min-w-[3ch]"
              style={{ width: `${Math.max(3, tag.length + 1)}ch` }}
              value={tag}
              onChange={(e) => updateItem(i, e.target.value)}
            />
            <button
              className="item-remove-text"
              onClick={() =>
                setProp(
                  "tags",
                  tags.filter((_: any, idx: number) => idx !== i),
                )
              }
            >
              ×
            </button>
          </span>
        ))}
        <button
          className={tagClass + " cursor-pointer"}
          onClick={() => setProp("tags", [...tags, ""])}
        >
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
