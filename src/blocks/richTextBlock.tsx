import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { generateHTML } from "@tiptap/html";

/* =========================
   EDITOR
========================= */

export function RichTextEditor({ block, update }: any) {
  const { content = null, size = "md", align = "start" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Enable levels 1 through 4
        heading: { levels: [1, 2, 3, 4] },
        // HorizontalRule is included in StarterKit
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "richtext-link",
        },
      }),
    ],
    content,
    onUpdate({ editor }) {
      setProp("content", editor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className="richtext-block-editor">
      {/* toolbar */}
      <div className="richtext-toolbar">
        {/* Bold/Italic */}
        <button
          className={`richtext-button ${editor.isActive("bold") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          className={`richtext-button ${editor.isActive("italic") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <div className="richtext-divider-v" />

        {/* Headings */}
        <button
          className={`richtext-button ${editor.isActive("heading", { level: 1 }) ? "is-active" : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          className={`richtext-button ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          className={`richtext-button ${editor.isActive("heading", { level: 3 }) ? "is-active" : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button
          className={`richtext-button ${editor.isActive("heading", { level: 4 }) ? "is-active" : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          H4
        </button>

        <div className="richtext-divider-v" />

        {/* Lists & HR */}
        <button
          className={`richtext-button ${editor.isActive("bulletList") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          className={`richtext-button ${editor.isActive("orderedList") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          className="richtext-button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          — Line
        </button>

        <div className="richtext-divider-v" />

        <button
          className={`richtext-button ${editor.isActive("link") ? "is-active" : ""}`}
          onClick={() => {
            const url = prompt("Enter URL", editor.getAttributes("link").href);
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </button>
      </div>

      {/* editor surface */}
      <div className="richtext-editor-surface">
        <EditorContent editor={editor} />
      </div>

      {/* Layout Controls */}
      <div className="richtext-controls">
        <select value={size} onChange={(e) => setProp("size", e.target.value)}>
          <option value="md">midsize</option>
          <option value="lg">big</option>
          <option value="xl">bigger</option>
        </select>

        <select
          value={align}
          onChange={(e) => setProp("align", e.target.value)}
        >
          <option value="start">start</option>
          <option value="center">center</option>
          <option value="end">end</option>
          <option value="justify">justify</option>
        </select>
      </div>
    </div>
  );
}

/* =========================
   RENDER
========================= */

export function RichTextRender({ block }: any) {
  const { content, size = "md", align = "start" } = block.props || {};
  if (!content) return null;

  // We re-use the same extensions to generate the HTML
  const html = generateHTML(content, [StarterKit, Link]);

  return (
    <div
      className={`richtext-block text-size-${size} text-align-${align}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

registerBlock({
  type: "richtext",
  label: "Rich Text",
  create: () => ({
    id: "",
    blockType: "richtext",
    props: { content: null, size: "md", align: "start" },
  }),
  Editor: RichTextEditor,
  Render: RichTextRender,
});
