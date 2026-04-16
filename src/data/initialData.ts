import type { FormStructure, LayoutItem } from "../utils/types";

export const initialForms: FormStructure[] = [
  {
    id: "0",
    title: "",
    blocks: [
      {
        id: "profile-image",
        blockType: "image",
        props: {
          src: "https://",
          alt: "تصویر شخصی",
          width: 100,
          shape: "rounded",
          align: "center",
        },
      },
      {
        id: "profile-name",
        blockType: "richtext",
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { textAlign: "center", level: 1 },
                content: [{ type: "text", text: "نام و نام خانوادگی" }],
              },
              {
                type: "heading",
                attrs: { textAlign: "center", level: 2 },
                content: [{ type: "text", text: "عنوان شغل یا مهارت" }],
              },
              {
                type: "paragraph",
                attrs: { textAlign: "center" },
              },
            ],
          },
          size: "md",
          align: "center",
        },
      },
    ],
  },

  {
    id: "1",
    title: "خلاصه‌ی رزومه",
    blocks: [
      {
        id: "summary",
        blockType: "richtext",
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "یک معرفی یا خلاصه از خودتان اینجا بنویسید",
                  },
                ],
              },
            ],
          },
          size: "md",
          align: "justify",
        },
      },
    ],
  },

  {
    id: "2",
    title: "زبان‌ها",
    blocks: [
      {
        id: "languages",
        blockType: "keyValue",
        props: {
          items: [
            { key: "انگلیسی", value: "سطح" },
            { key: "", value: "" },
          ],
          emphasis: "key",
        },
      },
    ],
  },

  {
    id: "3",
    title: "ارتباط",
    blocks: [
      {
        id: "contact-info",
        blockType: "keyValue",
        props: {
          items: [
            { key: "شماره تلفن", value: "" },
            { key: "", value: "" },
          ],
          emphasis: "key",
        },
      },
    ],
  },

  {
    id: "4",
    title: "سابقه‌ی شغلی",
    blocks: [
      {
        id: "experience",
        blockType: "richtext",
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "نام شرکت" }],
              },
              {
                type: "heading",
                attrs: { level: 3 },
                content: [{ type: "text", text: "سمت شغلی - مدت فعالیت" }],
              },
              {
                type: "bulletList",
                content: [
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "کارهای انجام شده" }],
                      },
                    ],
                  },
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "وظایف" }],
                      },
                    ],
                  },
                ],
              },
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "شرکت ۲" }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "..." }],
              },
              { type: "paragraph" },
            ],
          },
        },
      },
    ],
  },

  {
    id: "5",
    title: "پروژه‌ها",
    blocks: [
      {
        id: "projects",
        blockType: "richtext",
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "نام پروژه‌ی انجام شده" }],
              },
              {
                type: "bulletList",
                content: [
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          { type: "text", text: "توضیح کوتاه به همراه لینک" },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "پروژه‌ی دوم" }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "توضیحات و لینک" }],
              },
              { type: "paragraph" },
            ],
          },
        },
      },
    ],
  },

  {
    id: "6",
    title: "مهارت‌ها",
    blocks: [
      {
        id: "skills",
        blockType: "tags",
        props: {
          tags: ["برنامه‌نویسی", ""],
          shape: "pill",
          size: "md",
          variant: "filled",
        },
      },
    ],
  },
];
export const initialLayout: LayoutItem[] = [
  { id: "4", column: "left" }, // سابقه شغلی
  { id: "5", column: "left" }, // پروژه‌ها
  { id: "6", column: "left" }, // مهارت‌ها

  { id: "0", column: "right" }, // پروفایل
  { id: "1", column: "right" }, // خلاصه رزومه
  { id: "2", column: "right" }, // زبان‌ها
  { id: "3", column: "right" }, // ارتباط
];
