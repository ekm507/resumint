import type { DropdownOption, FormStructure } from "../utils/types";
import { category_icons } from "../utils/loadIcons";

const icons = category_icons("form");

const formTemplates: Record<string, FormStructure> = {
  profile: {
    id: "",
    title: "",
    blocks: [
      {
        id: "",
        blockType: "image",
        props: {
          src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTMuMjI5MTcybW0iCiAgIGhlaWdodD0iMjIuNDg5NTg2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMy4yMjkxNzIgMjIuNDg5NTg2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjQuMyAoMGQxNWY3NTA0MiwgMjAyNS0xMi0yNSkiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImF2YXRhci5zdmciCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOnpvb209IjEuOTg1NTMzNiIKICAgICBpbmtzY2FwZTpjeD0iLTIuMDE0NTcxOCIKICAgICBpbmtzY2FwZTpjeT0iNi41NDczNTgzIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA4IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTEuODcwODMsLTk2LjgzNzUwNCkiPgogICAgPCEtLSBiYWNrZ3JvdW5kIC0tPgogICAgPCEtLSBzaG91bGRlcnMgLS0+CiAgICA8IS0tIG5lY2sgLS0+CiAgICA8IS0tIGhlYWQgLS0+CiAgICA8IS0tIHNpbXBsZSBoYWlyIC0tPgogICAgPGNpcmNsZQogICAgICAgY3g9IjE1OC40ODU0MSIKICAgICAgIGN5PSIxMDQuMzg0ODgiCiAgICAgICByPSI1LjI4MjAyMzkiCiAgICAgICBmaWxsPSIjZmZkOWIzIgogICAgICAgaWQ9ImNpcmNsZTEiCiAgICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjAuMjExMjgxIiAvPgogICAgPGNpcmNsZQogICAgICAgY3g9IjE1Ni4zNzI2IgogICAgICAgY3k9IjEwMy4zMjg0OCIKICAgICAgIHI9IjAuODQ1MTIzNzciCiAgICAgICBpZD0iY2lyY2xlMi0zIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjIxMTI4MSIgLz4KICAgIDxjaXJjbGUKICAgICAgIGN4PSIxNjAuNTk4MjQiCiAgICAgICBjeT0iMTAzLjMyODQ4IgogICAgICAgcj0iMC44NDUxMjM3NyIKICAgICAgIGlkPSJjaXJjbGUzIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjIxMTI4MSIgLz4KICAgIDxyZWN0CiAgICAgICB4PSIxNTMuMjAzMzgiCiAgICAgICB5PSIxMDkuNjY2OTEiCiAgICAgICB3aWR0aD0iMTAuNTY0MDQ4IgogICAgICAgaGVpZ2h0PSI3LjM5NDgzNCIKICAgICAgIHJ4PSIzLjE2OTIxNDIiCiAgICAgICBmaWxsPSIjNmZhOGRjIgogICAgICAgaWQ9InJlY3QzIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjIxMTI4MSIgLz4KICA8L2c+Cjwvc3ZnPgo=",
          alt: "تصویر شخصی",
          width: 100,
          shape: "rounded",
          __advanced: true,
        },
      },
      {
        id: "",
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
        },
      },
    ],
  },

  summary: {
    id: "",
    title: "خلاصه‌ی رزومه",
    icon: icons["cv"],
    blocks: [
      {
        id: "",
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
        },
      },
    ],
  },

  languages: {
    id: "",
    title: "زبان‌ها",
    icon: icons["language"],
    blocks: [
      {
        id: "",
        blockType: "keyValue",
        props: {
          items: [
            { key: "انگلیسی", value: "سطح", icon: null, link: "" },
            { key: "", value: "", icon: null, link: "" },
          ],
          emphasis: "key",
        },
      },
    ],
  },

  contact: {
    id: "",
    title: "ارتباط",
    icon: icons["contact"],
    blocks: [
      {
        id: "",
        blockType: "keyValue",
        props: {
          items: [
            { key: "شماره تلفن", value: "", icon: null, link: "" },
            { key: "", value: "", icon: null, link: "" },
          ],
          emphasis: "key",
        },
      },
    ],
  },

  skills: {
    id: "",
    title: "مهارت‌ها",
    icon: icons["tools"],
    blocks: [
      {
        id: "",
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

  experience: {
    id: "",
    title: "سابقه‌ی شغلی",
    icon: icons["work"],
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
              {
                type: "paragraph",
              },
            ],
          },
        },
      },
    ],
  },

  projects: {
    id: "",
    title: "پروژه‌ها",
    icon: icons["project"],
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
};

export const formTemplateOptions: DropdownOption<FormStructure>[] =
  Object.entries(formTemplates).map(([name, form]) => ({
    value: form,
    label: form.title || name,
    icon: form.icon ? <img src={form.icon} /> : null,
  }));
