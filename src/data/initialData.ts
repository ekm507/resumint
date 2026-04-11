import type { FormStructure, LayoutItem } from "../utils/types";

export const initialForms: FormStructure[] = [
  {
    id: "0",
    title: "",
    blocks: [
      {
        id: "img1",
        blockType: "image",
        props: {
          src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTMuMjI5MTcybW0iCiAgIGhlaWdodD0iMjIuNDg5NTg2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMy4yMjkxNzIgMjIuNDg5NTg2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjQuMyAoMGQxNWY3NTA0MiwgMjAyNS0xMi0yNSkiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImF2YXRhci5zdmciCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOnpvb209IjEuOTg1NTMzNiIKICAgICBpbmtzY2FwZTpjeD0iLTIuMDE0NTcxOCIKICAgICBpbmtzY2FwZTpjeT0iNi41NDczNTgzIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA4IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTEuODcwODMsLTk2LjgzNzUwNCkiPgogICAgPCEtLSBiYWNrZ3JvdW5kIC0tPgogICAgPCEtLSBzaG91bGRlcnMgLS0+CiAgICA8IS0tIG5lY2sgLS0+CiAgICA8IS0tIGhlYWQgLS0+CiAgICA8IS0tIHNpbXBsZSBoYWlyIC0tPgogICAgPGNpcmNsZQogICAgICAgY3g9IjE1OC40ODU0MSIKICAgICAgIGN5PSIxMDQuMzg0ODgiCiAgICAgICByPSI1LjI4MjAyMzkiCiAgICAgICBmaWxsPSIjZmZkOWIzIgogICAgICAgaWQ9ImNpcmNsZTEiCiAgICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjAuMjExMjgxIiAvPgogICAgPGNpcmNsZQogICAgICAgY3g9IjE1Ni4zNzI2IgogICAgICAgY3k9IjEwMy4zMjg0OCIKICAgICAgIHI9IjAuODQ1MTIzNzciCiAgICAgICBpZD0iY2lyY2xlMi0zIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjIxMTI4MSIgLz4KICAgIDxjaXJjbGUKICAgICAgIGN4PSIxNjAuNTk4MjQiCiAgICAgICBjeT0iMTAzLjMyODQ4IgogICAgICAgcj0iMC44NDUxMjM3NyIKICAgICAgIGlkPSJjaXJjbGUzIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjIxMTI4MSIgLz4KICAgIDxyZWN0CiAgICAgICB4PSIxNTMuMjAzMzgiCiAgICAgICB5PSIxMDkuNjY2OTEiCiAgICAgICB3aWR0aD0iMTAuNTY0MDQ4IgogICAgICAgaGVpZ2h0PSI3LjM5NDgzNCIKICAgICAgIHJ4PSIzLjE2OTIxNDIiCiAgICAgICBmaWxsPSIjNmZhOGRjIgogICAgICAgaWQ9InJlY3QzIgogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDowLjIxMTI4MSIgLz4KICA8L2c+Cjwvc3ZnPgo=",
          width: 100,
          align: "center",
          shape: "rounded",
          alt: "avatar",
        },
      },
      {
        id: "name",
        blockType: "richtext",
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: "نام و نام خانوادگی" }],
              },
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "عنوان شغلی / تخصص" }],
              },
              { type: "paragraph" },
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
                    text: "متخصص در حوزه‌ی [زمینه کاری] با چند سال تجربه در طراحی، توسعه و بهبود سیستم‌ها. علاقه‌مند به یادگیری فناوری‌های جدید و همکاری در تیم‌های حرفه‌ای برای ساخت محصولات باکیفیت.",
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
    id: "7",
    title: "زبان‌ها",
    blocks: [
      {
        id: "languages",
        blockType: "keyValue",
        props: {
          items: [
            { key: "فارسی", value: "زبان مادری" },
            { key: "انگلیسی", value: "متوسط" },
          ],
          emphasis: "value",
          dividerStyle: "solid",
          dividerWidth: 2,
        },
      },
    ],
  },
  {
    id: "8",
    title: "ارتباط",
    blocks: [
      {
        id: "contact",
        blockType: "richtext",
        props: {
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "شماره تماس: ۰۹xxxxxxxxx" }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "ایمیل: example@email.com" }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "وب‌سایت: example.com" }],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "گیت‌هاب / لینکدین: username" },
                ],
              },
            ],
          },
          size: "lg",
          align: "center",
        },
      },
    ],
  },
  {
    id: "9",
    title: "مهارت‌ها",
    blocks: [
      {
        id: "skills",
        blockType: "tags",
        props: {
          tags: [
            "برنامه‌نویسی",
            "طراحی سیستم",
            "مدیریت پروژه",
            "Git",
            "Linux",
            "Docker",
            "کار تیمی",
            "حل مسئله",
          ],
          shape: "pill",
          size: "md",
          variant: "filled",
        },
      },
    ],
  },
  {
    id: "10",
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
                attrs: { level: 3 },
                content: [{ type: "text", text: "نام شرکت / سازمان" }],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "عنوان شغلی — سال شروع تا پایان" },
                ],
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
                          {
                            type: "text",
                            text: "شرح کوتاهی از مسئولیت یا دستاورد مهم.",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "فناوری‌ها یا ابزارهای استفاده‌شده.",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          size: "md",
          align: "start",
        },
      },
    ],
  },
  {
    id: "11",
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
                attrs: { level: 4 },
                content: [{ type: "text", text: "نام پروژه" }],
              },
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "توضیح کوتاه درباره‌ی هدف پروژه و فناوری‌های استفاده‌شده.",
                  },
                ],
              },
              {
                type: "heading",
                attrs: { level: 4 },
                content: [{ type: "text", text: "نام پروژه دیگر" }],
              },
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "توضیح کوتاه درباره‌ی ویژگی‌ها و نتیجه‌ی پروژه.",
                  },
                ],
              },
            ],
          },
          size: "md",
          align: "start",
        },
      },
    ],
  },
  {
    id: "12",
    title: "سابقه‌ی تحصیلی",
    blocks: [
      {
        id: "education",
        blockType: "keyValue",
        props: {
          items: [
            { key: "مقطع تحصیلی", value: "کارشناسی" },
            { key: "رشته", value: "نام رشته" },
            { key: "دانشگاه", value: "نام دانشگاه" },
            { key: "سال فارغ‌التحصیلی", value: "۱۴۰X" },
          ],
          emphasis: "key",
        },
      },
    ],
  },
];

export const initialLayout: LayoutItem[] = [
  { id: "0", column: "right" },
  { id: "1", column: "right" },
  { id: "7", column: "right" },
  { id: "9", column: "left" },
  { id: "10", column: "left" },
  { id: "11", column: "left" },
  { id: "12", column: "left" },
  { id: "8", column: "left" },
];
