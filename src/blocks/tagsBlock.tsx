// src/blocks/tagsBlock.tsx
import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";

export function TagsEditor({ block, update }: any) {
  const items: string[] = block.props?.items || [];

  const setItems = (newItems: string[]) =>
    update({
      ...block,
      props: { ...(block.props || {}), items: newItems },
    });

  const updateItem = (i: number, value: string) => {
    const copy = [...items];
    copy[i] = value;
    setItems(copy);
  };

  const deleteItem = (i: number) => {
    const copy = items.filter((_, idx) => idx !== i);
    setItems(copy);
  };

  const addItem = () => {
    setItems([...(items || []), ""]);
  };

  return (
    <div className="tags-block-editor">
      <div className="tags-block-items">
        {items.map((tag, i) => (
          <div key={i} className="tags-block-item">
            <input
              className="tags-block-input"
              value={tag}
              onChange={(e) => updateItem(i, e.target.value)}
            />
            <button
              className="tags-block-remove-button"
              onClick={() => deleteItem(i)}
            >
              remove
            </button>
          </div>
        ))}
      </div>

      <button className="tags-block-add-button" onClick={addItem}>
        + add tag
      </button>
    </div>
  );
}

export function TagsRender({ block }: any) {
  const items: string[] = block.props?.items || [];

  return (
    <div className="tags-block">
      {items.map((tag, i) => (
        <span key={i} className="tags-block-tag">
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
      },
    };
  },

  Editor: TagsEditor,
  Render: TagsRender,
});
