import { getBlock, getAllBlocks } from "../blocks/blockRegistry";
import type { Block } from "../utils/types";

interface Props {
  block: Block;
  updateBlock: (id: string, block: Block) => void;
  deleteBlock: (id: string) => void;
  setBlockType: (id: string, type: string) => void;
}

export default function BlockEditor({
  block,
  updateBlock,
  deleteBlock,
  setBlockType,
}: Props) {
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

        <button
          className="block-delete-button"
          onClick={() => deleteBlock(block.id)}
        >
          ❌
        </button>
      </div>

      <Editor
        block={block}
        update={(newBlock: Block) => updateBlock(block.id, newBlock)}
      />
    </div>
  );
}
