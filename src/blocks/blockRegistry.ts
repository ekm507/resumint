import type { Block } from "../utils/types";

export interface BlockDefinition {
  type: string;
  label: string;

  create(): Block;

  Editor: React.ComponentType<any>;
  Render: React.ComponentType<any>;
}

const registry: Record<string, BlockDefinition> = {};

export function registerBlock(def: BlockDefinition) {
  registry[def.type] = def;
}

export function getBlock(type: string) {
  return registry[type];
}

export function getAllBlocks() {
  return Object.values(registry);
}
