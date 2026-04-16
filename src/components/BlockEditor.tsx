import { getBlock, getAllBlocks } from "../blocks/blockRegistry";
import type { Block } from "../utils/types";

interface Props {
  block: Block;
  updateBlock: (id: string, block: Block) => void;
  deleteBlock: (id: string) => void;
  setBlockType: (id: string, type: string) => void;
  moveUp: () => void;
  moveDown: () => void;
}

export default function BlockEditor({
  block,
  updateBlock,
  deleteBlock,
  setBlockType,
  moveUp,
  moveDown,
}: Props) {
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
        {!block.isTemplate && (
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
        )}
      </div>

      {!block.isTemplate && (
        <div className="block-hover-controls">
          <button
            className="block-hover-button"
            onClick={moveUp}
            title="move block up"
          >
            ↑
          </button>

          <button
            className="block-hover-button"
            onClick={moveDown}
            title="move block down"
          >
            ↓
          </button>

          <button
            className="block-hover-button text-red-400"
            title="remove block"
            onClick={() => deleteBlock(block.id)}
          >
            ✕
          </button>
        </div>
      )}
      <Editor
        block={block}
        update={(newBlock: Block) => updateBlock(block.id, newBlock)}
      />
    </div>
  );
}
