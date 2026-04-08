import type { Block } from "./types";
import { getBlock } from "../blocks/blockRegistry";

export function nextId(items: { id: string }[]) {
  const last = items[items.length - 1];
  const lastId = last ? Number(last.id) : -1;
  return String(lastId + 1);
}

export function createBlock(type: string): Block {
  const def = getBlock(type);

  if (!def) {
    throw new Error(`Unknown block type: ${type}`);
  }

  const block = def.create();

  return {
    ...block,
    id: crypto.randomUUID(),
  };
}

export function resetPropsForType(type: string) {
  const def = getBlock(type);

  if (!def) return {};

  const block = def.create();

  return block.props ?? {};
}
