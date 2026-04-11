import { registerBlock } from "./blockRegistry";
import AdvancedOptions from "../components/AdvancedOptions";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { generateHTML } from "@tiptap/html";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Minus,
  Link as LinkIcon,
} from "lucide-react";
import Heading from "@tiptap/extension-link";
import ToggleButton from "../components/ToggleButton";

/* =========================
   TOOLBAR BUTTON
========================= */

function ToolbarButton({ active, onClick, title, children }: any) {
  return (
    <button
      className={`richtext-button ${active ? "is-active" : ""}`}
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

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
        heading: { levels: [1, 2, 3, 4] },
      }),
      Heading.extend({
        addKeyboardShortcuts() {
          return {
            "Ctrl-1": () => this.editor.commands.toggleHeading({ level: 1 }),
            "Ctrl-2": () => this.editor.commands.toggleHeading({ level: 2 }),
            "Ctrl-3": () => this.editor.commands.toggleHeading({ level: 3 }),
            "Ctrl-4": () => this.editor.commands.toggleHeading({ level: 4 }),
            "Ctrl-0": () => this.editor.commands.setParagraph(),
          };
        },
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

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      h4: editor.isActive("heading", { level: 4 }),
      bullet: editor.isActive("bulletList"),
      ordered: editor.isActive("orderedList"),
      link: editor.isActive("link"),
    }),
  });

  if (!editor) return null;

  return (
    <div className="richtext-block-editor">
      {/* toolbar */}
      <div className="richtext-toolbar">
        <ToolbarButton
          active={state.bold}
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.italic}
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} />
        </ToolbarButton>

        <div className="richtext-divider-v" />

        <ToolbarButton
          active={state.h1}
          title="Heading 1 (Ctrl+1)"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.h2}
          title="Heading 2 (Ctrl+2)"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.h3}
          title="Heading 3 (Ctrl+3)"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.h4}
          title="Heading 4 (Ctrl+4)"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <Heading4 size={14} />
        </ToolbarButton>

        <div className="richtext-divider-v" />

        <ToolbarButton
          active={state.bullet}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.ordered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={false}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={14} />
        </ToolbarButton>

        <div className="richtext-divider-v" />

        <ToolbarButton
          active={state.link}
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
          <LinkIcon size={14} />
        </ToolbarButton>
      </div>

      {/* editor surface */}
      <div className="richtext-editor-surface">
        <EditorContent editor={editor} />
      </div>

      {/* Layout Controls */}
      <div className="richtext-controls">
        <AdvancedOptions block={block} update={update}>
          <div className="options-grid">
            <div className="advanced-group">
              <label>size</label>
              <ToggleButton
                value={size}
                onChange={(v) => setProp("size", v)}
                options={[
                  { value: "md", label: "midsize" },
                  { value: "lg", label: "big" },
                  { value: "xl", label: "bigger" },
                ]}
              />
            </div>

            <div className="advanced-group">
              <label>align</label>
              <ToggleButton
                value={align}
                onChange={(v) => setProp("align", v)}
                options={[
                  { value: "start", label: "start" },
                  { value: "center", label: "center" },
                  { value: "end", label: "end" },
                  { value: "justify", label: "justify" },
                ]}
              />
            </div>
          </div>
        </AdvancedOptions>
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

  const html = generateHTML(content, [StarterKit, Link]);

  return (
    <div
      className={`richtext-block text-size-${size} text-align-${align}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* =========================
   BLOCK REGISTRATION
========================= */

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
