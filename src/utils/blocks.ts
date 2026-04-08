// src/utils/blocks.ts
import type { Block, BlockType } from "./types";

export function nextId(items: { id: string }[]) {
  const last = items[items.length - 1];
  const lastId = last ? +last.id : -1;
  return String(lastId + 1);
}

export function createBlock(type: BlockType = "text"): Block {
  const defaults: Record<BlockType, Partial<Block>> = {
    text: { props: { text: "" } },
    heading: { props: { text: "" } },
    list: { children: [], props: {} },
    // ... add other block types defaults here
  };
  const base: Block = {
    id: "0",
    blockType: type,
    props: {},
  };
  return { ...base, ...(defaults[type] as any) };
}

export function resetPropsForType(type: BlockType) {
  return createBlock(type).props ?? {};
}
