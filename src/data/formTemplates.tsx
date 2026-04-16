import type { DropdownOption, FormStructure } from "../utils/types";
import { loadAllIcons } from "../utils/loadIcons";

const loadedIcons = await loadAllIcons();
const dir = "form";
const filteredIcons = dir
  ? loadedIcons.filter((i) => i.path === dir || i.path.startsWith(dir + "/"))
  : loadedIcons;

const icons = Object.fromEntries(
  filteredIcons.map((icon) => [icon.name, icon.src]),
);

const formTemplates: Record<string, FormStructure> = {
  education: {
    id: "",
    title: "Education",
    icon: icons["study"],
    blocks: [
      {
        id: "",
        blockType: "keyValue",
        props: {
          items: [
            { key: "Degree", value: "Bachelor of ..." },
            { key: "University", value: "University name" },
            { key: "Year", value: "2024" },
          ],
        },
      },
    ],
  },

  experience: {
    id: "",
    title: "Experience",
    blocks: [
      {
        id: "",
        blockType: "richtext",
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 3 },
                content: [{ type: "text", text: "Company name" }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "Role — 2022–2025" }],
              },
            ],
          },
          size: "md",
        },
      },
    ],
  },

  skills: {
    id: "",
    title: "Skills",
    blocks: [
      {
        id: "",
        blockType: "tags",
        props: {
          tags: ["React", "TypeScript", "Docker"],
        },
      },
    ],
  },
  custom: {
    id: "",
    title: "",
    blocks: [],
  },
};

export const formTemplateOptions: DropdownOption<FormStructure>[] =
  Object.entries(formTemplates).map(([name, form]) => ({
    value: form,
    label: form.title || name,
    icon: form.icon ? <img src={form.icon} /> : null,
  }));
