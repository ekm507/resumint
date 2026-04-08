import type { FormStructure, LayoutItem } from "../utils/types";

export const initialForms: FormStructure[] = [
  {
    id: "0",
    title: "Personal Information",
    blocks: [
      { id: "0", blockType: "heading", props: { text: "name" } },
      { id: "1", blockType: "text", props: { text: "Erfan Kheyrollahi" } },
      { id: "2", blockType: "heading", props: { text: "Age" } },
      { id: "3", blockType: "text", props: { text: "27" } },
    ],
  },
  {
    id: "1",
    title: "Properties",
    blocks: [
      { id: "0", blockType: "heading", props: { text: "items in bag" } },
      {
        id: "1",
        blockType: "list",
        children: [
          { id: "1-0", blockType: "text", props: { text: "pen" } },
          { id: "1-1", blockType: "text", props: { text: "notebook" } },
          { id: "1-2", blockType: "text", props: { text: "laptop" } },
          { id: "1-3", blockType: "text", props: { text: "tissues" } },
          { id: "1-4", blockType: "text", props: { text: "bicycle keys" } },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "story",
    blocks: [
      {
        id: "0",
        blockType: "text",
        props: {
          text: "once there was a ship on the sea and the name of the ship was billy o tea.",
        },
      },
      {
        id: "1",
        blockType: "text",
        props: {
          text: "soon may the wellerman come. to bring us sugar and tea and rum...",
        },
      },
    ],
  },
];

export const initialLayout: LayoutItem[] = [
  { id: "0", column: "left" },
  { id: "1", column: "right" },
  { id: "2", column: "left" },
];
