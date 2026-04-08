export type DirTypeNames = "lrt" | "rtl" | "auto";

export type LayoutItem = {
  id: string;
  column: "left" | "right";
};

export type BlockType =
  | "text"
  | "heading"
  | "list"
  | "image"
  | "link"
  | "divider";

export interface Block {
  id: string;
  blockType: BlockType;
  props?: Record<string, any>;
  children?: Block[];
}

export const BlockTypesList: BlockType[] = [
  "text",
  "heading",
  "list",
  "image",
  "link",
  "divider",
];

export interface FormStructure {
  id: string;
  title: string;
  blocks: Block[];
}
