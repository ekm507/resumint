import { Fragment, useState } from "react";
import type { FormStructure, Block } from "../utils/types";
import BlockEditor from "./BlockEditor";
import { getBlock } from "../blocks/blockRegistry";
import { useBlockOps } from "../hooks/useBlockOps";
import AddBlockMenu from "./AddBlockMenu";

interface Props {
  form: FormStructure;
  onFormChange: (id: string, newForm: FormStructure) => void;
  onDelete: (id: string) => void;
}

export default function MiniForm({ form, onFormChange, onDelete }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const setForm = (patch: Partial<FormStructure>) => {
    onFormChange(form.id, { ...form, ...patch });
  };

  const updateBlocks = (blocks: Block[]) => setForm({ blocks });

  const {
    updateBlock,
    deleteBlock,
    moveBlock,
    insertBlockAfter,
    setBlockType,
  } = useBlockOps(form.blocks, updateBlocks);

  const addFirstBlock = (type: string) => {
    const def = getBlock(type);
    if (!def) return;

    const newBlock = { ...def.create(), id: crypto.randomUUID() };

    updateBlocks([newBlock]);
  };

  const backgrounds = [
    "transparent",
    "accent-50",
    "accent-100",
    "accent-200",
    "accent-300",
  ];

  const cycleBackground = () => {
    const current = form.background ?? "transparent";
    const index = backgrounds.indexOf(current);
    const next = backgrounds[(index + 1) % backgrounds.length];

    setForm({ background: next });
  };

  const current = form.background ?? "transparent";

  const bg =
    current === "transparent"
      ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 8px 8px"
      : `var(--${current})`;

  return (
    <div className="editor-form">
      <div className="editor-form-header">
        <button onClick={() => onDelete(form.id)}>❌</button>

        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "▶" : "▼"}
        </button>

        <input
          value={form.title}
          onChange={(e) => setForm({ title: e.target.value })}
        />
        <button
          type="button"
          onClick={cycleBackground}
          title={`Background: ${current}`}
          className="background-toggle-button"
        ></button>
      </div>

      {!collapsed && (
        <div className="editor-form-body">
          {form.blocks.length === 0 ? (
            <AddBlockMenu
              onSelect={(type) => {
                addFirstBlock(type);
              }}
            />
          ) : (
            form.blocks.map((block) => (
              <Fragment key={block.id}>
                <BlockEditor
                  block={block}
                  updateBlock={updateBlock}
                  deleteBlock={deleteBlock}
                  setBlockType={setBlockType}
                  moveUp={() => moveBlock(block.id, "up")}
                  moveDown={() => moveBlock(block.id, "down")}
                />
                <AddBlockMenu
                  key={"menu-" + block.id}
                  onSelect={(type) => {
                    insertBlockAfter(block.id, type);
                  }}
                />
              </Fragment>
            ))
          )}
        </div>
      )}
    </div>
  );
}
