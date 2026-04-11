export type DirTypeNames = "ltr" | "rtl" | "auto";

export type LayoutItem = {
  id: string;
  column: "left" | "right";
};

export type BlockType = string;

export interface Block {
  id: string;
  blockType: BlockType;
  props?: Record<string, any>;
  children?: Block[];
}

export type SplitBlock = Block & {
  left: Block;
  right: Block;
};

export type BlockNode = Block | SplitBlock;

export interface FormStructure {
  id: string;
  title: string;
  blocks: BlockNode[];
  background?: string | null;
}
