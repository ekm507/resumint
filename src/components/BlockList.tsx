// src/components/BlockList.tsx
import BlockEditor from "./BlockEditor";
import type { Block, BlockType } from "../utils/types";

interface BlockListProps {
  blocks: Block[];
  updateBlock: (blockId: string, props: any) => void;
  deleteBlock: (blockId: string) => void;
  setBlockType: (blockId: string, type: BlockType) => void;
}

export default function BlockList({
  blocks,
  updateBlock,
  deleteBlock,
  setBlockType,
}: BlockListProps) {
  return (
    <div className="editor-form-rows">
      {blocks.map((block) => (
        <BlockEditor
          key={block.id}
          block={block}
          updateBlock={updateBlock}
          deleteBlock={deleteBlock}
          setBlockType={setBlockType}
        />
      ))}
    </div>
  );
}
