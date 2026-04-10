import { useState } from "react";
import type { FormStructure, Block } from "../utils/types";
import BlockEditor from "./BlockEditor";
import { getBlock, getAllBlocks } from "../blocks/blockRegistry";
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
    setShowAdd(false);
  };

  const [showAdd, setShowAdd] = useState(false);

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
      </div>

      {!collapsed && (
        <div className="editor-form-body">
          {form.blocks.length === 0 ? (
            <div className="empty-block-state">
              <AddBlockMenu
                buttonText="+ Add Block"
                onSelect={(type) => {
                  insertBlockAfter(block.id, type);
                }}
              />
            </div>
          ) : (
            form.blocks.map((block) => (
              <>
                <BlockEditor
                  key={block.id}
                  block={block}
                  updateBlock={updateBlock}
                  deleteBlock={deleteBlock}
                  setBlockType={setBlockType}
                  moveUp={() => moveBlock(block.id, "up")}
                  moveDown={() => moveBlock(block.id, "down")}
                  insertBlockAfter={insertBlockAfter}
                />
                <AddBlockMenu
                  buttonText="+ Add Block"
                  onSelect={(type) => {
                    addFirstBlock(type);
                  }}
                />
              </>
            ))
          )}
        </div>
      )}
    </div>
  );
}
