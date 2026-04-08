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
        },
      },
      {
        id: "name",
        blockType: "heading",
        props: {
          text: "نام و نام خانوادگی",
          level: 1,
          align: "center",
        },
      },
      {
        id: "title",
        blockType: "heading",
        props: {
          text: "عنوان شغلی (مثلاً توسعه‌دهنده نرم‌افزار)",
          level: 3,
          align: "center",
        },
      },
    ],
  },
  {
    id: "1",
    title: "خلاصه حرفه‌ای",
    blocks: [
      {
        id: "summary",
        blockType: "text",
        props: {
          text: "در این بخش یک توضیح کوتاه درباره‌ی تجربه‌ها، حوزه‌ی تخصص و علایق حرفه‌ای خود بنویسید. معمولاً ۳ تا ۴ خط کافی است.",
          align: "justify",
        },
      },
    ],
  },
  {
    id: "2",
    title: "مهارت‌ها",
    blocks: [
      {
        id: "skills",
        blockType: "tags",
        props: {
          items: [
            "Python",
            "JavaScript",
            "React / Next.js",
            "Backend Development",
            "SQL / NoSQL",
            "Docker",
            "Linux",
            "Git",
          ],
        },
      },
    ],
  },
  {
    id: "3",
    title: "سوابق شغلی",
    blocks: [
      {
        id: "job1title",
        blockType: "heading",
        props: { text: "نام شرکت یا سازمان", level: 3 },
      },
      {
        id: "job1desc",
        blockType: "text",
        props: {
          text: "توضیح کوتاه درباره‌ی مسئولیت‌ها، تکنولوژی‌های استفاده‌شده و دستاوردهای مهم در این موقعیت شغلی.",
        },
      },
      {
        id: "jobdivider",
        blockType: "divider",
        props: { style: "solid", spacing: "md" },
      },
      {
        id: "job2title",
        blockType: "heading",
        props: { text: "نام شرکت قبلی", level: 3 },
      },
      {
        id: "job2desc",
        blockType: "text",
        props: {
          text: "در این بخش می‌توانید تجربه‌ی شغلی دیگر خود را شرح دهید.",
        },
      },
    ],
  },
  {
    id: "4",
    title: "پروژه‌ها",
    blocks: [
      {
        id: "projtitle",
        blockType: "heading",
        props: { text: "نام پروژه", level: 3 },
      },
      {
        id: "projdesc",
        blockType: "text",
        props: {
          text: "توضیح کوتاه درباره‌ی پروژه، تکنولوژی‌های استفاده‌شده و هدف آن.",
        },
      },
      {
        id: "projlink",
        blockType: "link",
        props: {
          text: "لینک پروژه",
          url: "https://example.com",
        },
      },
    ],
  },
  {
    id: "5",
    title: "تحصیلات",
    blocks: [
      {
        id: "edu",
        blockType: "keyValue",
        props: {
          key: "مقطع و رشته تحصیلی",
          value: "نام دانشگاه",
          text: "مثال: کارشناسی مهندسی نرم‌افزار",
        },
      },
    ],
  },
  {
    id: "6",
    title: "اطلاعات تماس",
    blocks: [
      { id: "phone", blockType: "text", props: { text: "شماره تماس" } },
      {
        id: "website",
        blockType: "link",
        props: { text: "وبسایت شخصی", url: "https://example.com" },
      },
      {
        id: "github",
        blockType: "link",
        props: { text: "GitHub", url: "https://github.com/username" },
      },
      {
        id: "linkedin",
        blockType: "link",
        props: {
          text: "LinkedIn",
          url: "https://linkedin.com/in/username",
        },
      },
    ],
  },
  {
    id: "7",
    title: "زبان‌ها",
    blocks: [
      {
        id: "lang",
        blockType: "vertical-split",
        props: {
          dividerStyle: "solid",
          dividerVisible: true,
          dividerWidth: 2,
          ratio: "50-50",
        },
        left: {
          id: "lang1",
          blockType: "text",
          props: { text: "نام زبان" },
        },
        right: {
          id: "langlevel",
          blockType: "text",
          props: { text: "سطح (مثلاً B2 / C1)" },
        },
      },
    ],
  },
  {
    id: "8",
    title: "علایق یا دستاوردها",
    blocks: [
      {
        id: "list1",
        blockType: "list",
        props: { style: "ul" },
        children: [
          {
            id: "li1",
            blockType: "text",
            props: { text: "مورد اول (مثلاً مشارکت در پروژه‌های متن‌باز)" },
          },
          {
            id: "li2",
            blockType: "text",
            props: { text: "مورد دوم (مثلاً سخنرانی یا مقاله)" },
          },
          {
            id: "li3",
            blockType: "text",
            props: { text: "مورد سوم" },
          },
        ],
      },
    ],
  },
];

export const initialLayout: LayoutItem[] = [
  { id: "0", column: "right" },
  { id: "1", column: "right" },
  { id: "7", column: "right" },
  { id: "6", column: "right" },
  { id: "2", column: "left" },
  { id: "3", column: "left" },
  { id: "4", column: "left" },
  { id: "5", column: "left" },
  { id: "8", column: "left" },
];
