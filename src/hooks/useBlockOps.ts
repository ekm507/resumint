import type { Block } from "../utils/types";
import { getBlock } from "../blocks/blockRegistry";

export function useBlockOps(
  blocks: Block[],
  setBlocks: (blocks: Block[]) => void,
) {
  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks(blocks.map((b) => (b.id === id ? newBlock : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    const newBlocks = [...blocks];

    if (direction === "up" && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
    }

    if (direction === "down" && index < newBlocks.length - 1) {
      [newBlocks[index + 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index + 1],
      ];
    }

    setBlocks(newBlocks);
  };

  const insertBlockAfter = (id: string, type: string) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    const def = getBlock(type);
    if (!def) return;

    const newBlock = { ...def.create(), id: crypto.randomUUID() };

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);

    setBlocks(newBlocks);
  };

  const setBlockType = (id: string, type: string) => {
    const def = getBlock(type);
    if (!def) return;

    setBlocks(
      blocks.map((b) => {
        if (b.id !== id) return b;

        const newBlock = def.create();

        return {
          ...newBlock,
          id,
          props: {
            ...newBlock.props,
            ...b.props,
          },
        };
      }),
    );
  };

  return {
    updateBlock,
    deleteBlock,
    moveBlock,
    insertBlockAfter,
    setBlockType,
  };
}
