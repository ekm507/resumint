import { useEffect, useState, useRef } from "react";
import BlockRenderer from "./BlockRenderer";
import BlockEditor from "./BlockEditor";
import AddBlockMenu from "./AddBlockMenu";
import IconSelect from "./IconSelect";
import { useBlockOps } from "../hooks/useBlockOps";
import { getBlock } from "../blocks/blockRegistry";
import type { FormStructure, DirTypeNames } from "../utils/types";
import { useI18n } from "../i18nContext";

interface Prop {
  form: FormStructure;
  dir?: DirTypeNames;
  onFormChange?: (id: string, newForm: FormStructure) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

export default function MiniBox({
  form,
  dir = "auto",
  onFormChange,
  onDelete,
  editable = true,
  onEditingChange,
}: Prop) {
  const isTemplate = Boolean(form.isTemplate);
  const canEdit = editable && Boolean(onFormChange) && Boolean(onDelete);
  const { t } = useI18n();

  const sectionRef = useRef<HTMLElement | null>(null);
  const [titleFocused, setTitleFocused] = useState(false);
  void dir;

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!canEdit) setSelectedBlockId(null);
  }, [canEdit]);

  useEffect(() => {
    onEditingChange?.(selectedBlockId !== null);
  }, [selectedBlockId, onEditingChange]);

  useEffect(() => {
    if (!isFocused) return;
    const handler = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (target instanceof Element && target.closest(".icon-select-menu, .icon-select-box")) {
        return;
      }
      if (sectionRef.current && sectionRef.current.contains(target)) return;
      setIsFocused(false);
      setTitleFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isFocused]);

  useEffect(() => {
    if (selectedBlockId !== null) return;
    // close any advanced options when editor closes
    if (form.blocks.some((b: any) => b?.props?.__advanced)) {
      setForm({
        blocks: form.blocks.map((b: any) => ({
          ...b,
          props: { ...(b.props || {}), __advanced: false },
        })),
      });
    }
  }, [selectedBlockId]);
  const setForm = (patch: Partial<FormStructure>) => {
    if (!onFormChange) return;
    onFormChange(form.id, { ...form, ...patch });
  };

  const updateBlocks = (blocks: FormStructure["blocks"]) =>
    setForm({ blocks });

  const blockOps = useBlockOps(form.blocks, updateBlocks);

  const addFirstBlock = (type: string) => {
    const def = getBlock(type);
    if (!def) return;

    const newBlock = { ...def.create(), id: crypto.randomUUID() };
    updateBlocks([newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const cycleBackground = () => {
    const backgrounds = [
      "transparent",
      "accent-50",
      "accent-100",
      "accent-200",
      "accent-300",
    ];
    const current = form.background ?? "transparent";
    const index = backgrounds.indexOf(current);
    const next = backgrounds[(index + 1) % backgrounds.length];
    setForm({ background: next });
  };

  const bg =
    !form.background || form.background === "transparent"
      ? "transparent"
      : `var(--${form.background})`;

  useEffect(() => {
    if (selectedBlockId === null) return;
    const handler = (event: MouseEvent) => {
      if ((window as any).__imageFileDialogOpen || (window as any).__iconSelectOpen) return;
      const el = wrapperRefs.current[selectedBlockId];
      if (el && !el.contains(event.target as Node)) {
        setSelectedBlockId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedBlockId]);

  // Read-only render (used in drag overlays / print)
  if (!canEdit) {
    return (
      <section
        ref={sectionRef as any}
        className="resume-section"
        dir="auto"
        style={{ backgroundColor: bg }}
      >
        {(form.icon || form.title) && (
          <div className="resume-section-header">
            {form.icon && <img className="resume-section-icon" src={form.icon} />}
            {form.title && <h1 className="resume-section-title">{form.title}</h1>}
          </div>
        )}

        <div className="resume-section-content">
          {form.blocks?.map((block) => (
            <BlockRenderer key={block.id} block={block} editable={canEdit} />
          ))}
        </div>
      </section>
    );
  }

  const currentBackground = form.background ?? "transparent";

  return (
    <section
      ref={sectionRef as any}
      className="resume-section"
      dir="auto"
      style={{ backgroundColor: bg }}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if ((window as any).__iconSelectOpen) return;
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocused(false);
          if (form.blocks.some((b: any) => b?.props?.__advanced)) {
            setForm({
              blocks: form.blocks.map((b: any) => ({
                ...b,
                props: { ...(b.props || {}), __advanced: false },
              })),
            });
          }
        }
      }}
    >
      <div className="resume-section-header">
        {(isFocused || titleFocused) && !isTemplate ? (
          <IconSelect
            dir="form"
            value={form.icon}
            onSelect={(i) => setForm({ icon: i })}
          />
        ) : (
          form.icon && <img className="resume-section-icon" src={form.icon} />
        )}
        <h1
          data-placeholder={t("placeholder.sectionTitle")}
          className={`resume-section-title ${
            canEdit && !(form.title || "").trim()
              ? (isFocused || titleFocused)
                ? "title-placeholder-active"
                : "title-placeholder"
              : ""
          }`}
          tabIndex={0}
          contentEditable={isFocused || titleFocused}
          suppressContentEditableWarning
          onFocus={() => {
            setIsFocused(true);
            setTitleFocused(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.currentTarget.blur();
              setTitleFocused(false);
            }
          }}
          onBlur={(e) => {
            if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
            setForm({ title: e.currentTarget.textContent || "" });
            setTitleFocused(false);
          }}
        >
          {form.title}
        </h1>
      </div>

      <div className="section-floating-controls">
        <button
          type="button"
          onClick={cycleBackground}
          title={`${t("form.background")}: ${currentBackground}`}
          className="background-toggle-button"
        />
        <button
          onClick={() => onDelete?.(form.id)}
          className="form-remove-button"
          title={t("form.remove")}
        >
          ×
        </button>
      </div>

      <div className="resume-section-content">
          {form.blocks.length === 0 && !isTemplate ? (
            <AddBlockMenu onSelect={addFirstBlock} />
          ) : null}

          {form.blocks.map((block) => (
            <div
              key={block.id}
              className="resume-block-wrapper"
              ref={(el) => {
                wrapperRefs.current[block.id] = el;
              }}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                }
              }}
              onBlur={(e) => {
                if ((window as any).__imageFileDialogOpen || (window as any).__iconSelectOpen) return;
                if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                const active = document.activeElement;
                if (active === null || active === document.body) return;
                setSelectedBlockId(null);
              }}
            >
              {selectedBlockId === block.id ? (
                <>
                  <div className="block-editor-floating-wrap">
                    <BlockEditor
                      block={{ ...block, isTemplate }}
                      updateBlock={blockOps.updateBlock}
                      deleteBlock={blockOps.deleteBlock}
                      setBlockType={blockOps.setBlockType}
                      moveUp={() => blockOps.moveBlock(block.id, "up")}
                      moveDown={() => blockOps.moveBlock(block.id, "down")}
                    />
                    <button
                      className="block-done-button"
                      title={t("block.finishEditing")}
                      onClick={() => setSelectedBlockId(null)}
                    >
                      ✓
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onMouseDownCapture={(event) => {
                    if (block.blockType === "richtext" && event.button === 0) {
                      // Keep focus-driven header changes from moving the click target.
                      // The editor takes focus after the completed click opens it.
                      event.preventDefault();
                    }
                  }}
                  onClickCapture={() => setSelectedBlockId(block.id)}
                  style={{ cursor: "pointer" }}
                >
                  <BlockRenderer block={block} editable={canEdit} />
                </div>
              )}

              {!isTemplate && (
                <div className="add-block-float">
                  <AddBlockMenu
                    key={"menu-" + block.id}
                    onSelect={(type) => {
                      blockOps.insertBlockAfter(block.id, type);
                      setSelectedBlockId(null);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
    </section>
  );
}
