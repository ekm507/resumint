import { registerBlock } from "./blockRegistry";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
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
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
} from "lucide-react";

import { useState } from "react";
import { useI18n } from "../i18nContext";

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
  const { t } = useI18n();
  const { content = null } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const editor = useEditor({
    extensions: [
      // Disable heading & link from StarterKit to avoid duplicates
      StarterKit.configure({
        heading: false,
        link: false,
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
      }).configure({
        levels: [1, 2, 3, 4],
      }),

      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "richtext-link",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    autofocus: true,
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

  function AlignDropdown({ editor }: { editor: any }) {
    const [open, setOpen] = useState(false);

    const current = editor.getAttributes("paragraph").textAlign || "left";

    return (
      <div className="richtext-dropdown">
        <button
          className="richtext-button"
          title={t("richtext.align")}
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          {current === "left" && <TextAlignStart size={14} />}
          {current === "center" && <TextAlignCenter size={14} />}
          {current === "right" && <TextAlignEnd size={14} />}
          {current === "justify" && <TextAlignJustify size={14} />}
        </button>

        {open && (
          <div className="richtext-menu">
            <button
              className="richtext-item richtext-button"
              title={t("richtext.left")}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("left").run();
                setOpen(false);
              }}
            >
              <TextAlignStart size={14} />
            </button>

            <button
              className="richtext-item richtext-button"
              title={t("richtext.center")}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("center").run();
                setOpen(false);
              }}
            >
              <TextAlignCenter size={14} />
            </button>

            <button
              className="richtext-item richtext-button"
              title={t("richtext.right")}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("right").run();
                setOpen(false);
              }}
            >
              <TextAlignEnd size={14} />
            </button>

            <button
              className="richtext-item richtext-button"
              title={t("richtext.justify")}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("justify").run();
                setOpen(false);
              }}
            >
              <TextAlignJustify size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="richtext-block-editor">
      {/* toolbar */}
      <div className="richtext-toolbar">
        <ToolbarButton
          active={state.bold}
          title={t("richtext.bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.italic}
          title={t("richtext.italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} />
        </ToolbarButton>

        <div className="richtext-divider-v" />

        <ToolbarButton
          active={state.h1}
          title={t("richtext.heading1")}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.h2}
          title={t("richtext.heading2")}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.h3}
          title={t("richtext.heading3")}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={state.h4}
          title={t("richtext.heading4")}
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
            const url = prompt(t("richtext.enterUrl"), editor.getAttributes("link").href);

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

        <div className="richtext-divider-v" />

        <AlignDropdown editor={editor} />
      </div>

      {/* editor surface */}
      <div className="richtext-editor-surface" dir="auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/* =========================
   RENDER
========================= */

export function RichTextRender({ block, editable = true }: any) {
  const { t } = useI18n();
  const { content, size = "md" } = block.props || {};

  const hasText = (node: any): boolean => {
    if (!node) return false;
    if (typeof node.text === "string" && node.text.trim() !== "") return true;
    if (Array.isArray(node.content))
      return node.content.some((child: any) => hasText(child));
    return false;
  };

  if (!hasText(content)) {
    if (!editable) return null;
    return (
      <div className={`richtext-block text-size-${size} richtext-placeholder`} dir="auto">
        {t("placeholder.text")}
      </div>
    );
  }

  const html = generateHTML(content, [
    StarterKit.configure({ heading: false, link: false }),
    Heading.configure({ levels: [1, 2, 3, 4] }),
    Link,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ]);

  return (
    <div
      className={`richtext-block text-size-${size}`}
      dir="auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* =========================
   BLOCK REGISTRATION
========================= */

registerBlock({
  type: "richtext",
  label: "block.richText",
  create: () => ({
    id: "",
    blockType: "richtext",
    props: { content: null },
  }),
  Editor: RichTextEditor,
  Render: RichTextRender,
});
