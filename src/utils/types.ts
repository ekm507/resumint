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
  isTemplate?: boolean;
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
  icon?: string | null;
  isTemplate?: boolean;
}

export interface DropdownOption<T> {
  value: T;
  label?: string;
  icon?: React.ReactNode; // SVG or any JSX
  key: string;
}
