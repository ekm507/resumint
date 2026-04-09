import { useState } from "react";
import { getBlock, getAllBlocks } from "../blocks/blockRegistry";
import type { Block } from "../utils/types";

interface Props {
  block: Block;
  updateBlock: (id: string, block: Block) => void;
  deleteBlock: (id: string) => void;
  setBlockType: (id: string, type: string) => void;
  moveUp: () => void;
  moveDown: () => void;
  insertBlockAfter: (id: string, type: string) => void;
}

export default function BlockEditor({
  block,
  updateBlock,
  deleteBlock,
  setBlockType,
  moveUp,
  moveDown,
  insertBlockAfter,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);

  if (!block) {
    return <div className="block-editor-error">Missing block</div>;
  }

  const def = getBlock(block.blockType);
  const blocks = getAllBlocks();

  if (!def) {
    return (
      <div className="block-editor-error">Unknown block: {block.blockType}</div>
    );
  }

  const Editor = def.Editor;

  return (
    <div className="block-editor">
      <div className="block-editor-header">
        <select
          className="block-type-select"
          value={block.blockType}
          onChange={(e) => setBlockType(block.id, e.target.value)}
        >
          {blocks.map((b) => (
            <option key={b.type} value={b.type}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div className="block-hover-controls">
        <button className="block-hover-button" onClick={moveUp}>
          ↑
        </button>

        <button className="block-hover-button" onClick={moveDown}>
          ↓
        </button>

        <button
          className="block-hover-button"
          onClick={() => setAddOpen(!addOpen)}
        >
          +
        </button>

        <button
          className="block-hover-button text-red-400"
          onClick={() => deleteBlock(block.id)}
        >
          ✕
        </button>

        {addOpen && (
          <div className="block-add-menu">
            <div className="block-add-grid">
              {blocks.map((b) => (
                <button
                  key={b.type}
                  className="block-add-item"
                  onClick={() => {
                    insertBlockAfter(block.id, b.type);
                    setAddOpen(false);
                  }}
                >
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Editor
        block={block}
        update={(newBlock: Block) => updateBlock(block.id, newBlock)}
      />
    </div>
  );
}
