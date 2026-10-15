import { useEffect, useState } from "react";
import BlockRenderer from "./BlockRenderer";
import BlockEditor from "./BlockEditor";
import AddBlockMenu from "./AddBlockMenu";
import IconSelect from "./IconSelect";
import { useBlockOps } from "../hooks/useBlockOps";
import { getBlock } from "../blocks/blockRegistry";
import type { FormStructure, DirTypeNames } from "../utils/types";

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

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!canEdit) setSelectedBlockId(null);
  }, [canEdit]);

  useEffect(() => {
    onEditingChange?.(selectedBlockId !== null);
  }, [selectedBlockId, onEditingChange]);

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

  // Read-only render (used in drag overlays / print)
  if (!canEdit) {
    return (
      <section
        className="resume-section"
        dir={dir}
        style={{ backgroundColor: bg }}
      >
        <div className="resume-section-header">
          {form.icon && <img className="resume-section-icon" src={form.icon} />}
          {form.title && <h1 className="resume-section-title">{form.title}</h1>}
        </div>

        <div className="resume-section-content">
          {form.blocks?.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </section>
    );
  }

  const currentBackground = form.background ?? "transparent";

  return (
    <section
      className="resume-section"
      dir={dir}
      style={{ backgroundColor: bg }}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
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
        {!isFocused && (
          <>
            {form.icon && <img className="resume-section-icon" src={form.icon} />}
            {form.title && (
              <h1
                className="resume-section-title"
                tabIndex={0}
              >
                {form.title}
              </h1>
            )}
            {!form.title && <h1 className="resume-section-title" tabIndex={0} />}
          </>
        )}

        {isFocused && (
          <>
            {!isTemplate && (
              <IconSelect
                dir="form"
                value={form.icon}
                onSelect={(i) => setForm({ icon: i })}
              />
            )}
            {isTemplate && form.icon && (
              <img className="resume-section-icon" src={form.icon} />
            )}
            <input
              className="resume-section-title bg-transparent border-0 outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"
              placeholder="title"
              title="form title"
              value={form.title}
              onChange={(e) => setForm({ title: e.target.value })}
              autoFocus
            />
          </>
        )}
      </div>

      <div className="section-floating-controls">
        <button
          type="button"
          onClick={cycleBackground}
          title={`Background: ${currentBackground}`}
          className="background-toggle-button"
        />
        <button
          onClick={() => onDelete?.(form.id)}
          className="form-remove-button"
          title="remove form"
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
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setSelectedBlockId(null);
                }
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
                      title="finish editing"
                      onClick={() => setSelectedBlockId(null)}
                    >
                      ✓
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setSelectedBlockId(block.id)}
                  style={{ cursor: "pointer" }}
                >
                  <BlockRenderer block={block} />
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