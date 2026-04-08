import { useState } from "react";
import type { FormStructure, Block } from "../utils/types";
import BlockEditor from "./BlockEditor";
import { getAllBlocks, getBlock } from "../blocks/blockRegistry";

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

  const updateBlocks = (blocks: Block[]) => {
    setForm({ blocks });
  };

  const updateBlock = (id: string, newBlock: Block) => {
    updateBlocks(form.blocks.map((b) => (b.id === id ? newBlock : b)));
  };

  const deleteBlock = (id: string) => {
    updateBlocks(form.blocks.filter((b) => b.id !== id));
  };

  const setBlockType = (id: string, type: string) => {
    const def = getBlock(type);
    if (!def) return;

    updateBlocks(
      form.blocks.map((b) => {
        if (b.id !== id) return b;

        const newBlock = def.create();

        return {
          ...newBlock,
          id,
          props: {
            ...newBlock.props,
            ...b.props, // preserve existing props
          },
        };
      }),
    );
  };

  const addBlock = (type: string) => {
    const def = getBlock(type);
    if (!def) return;

    const block = def.create();

    block.id = crypto.randomUUID();

    updateBlocks([...form.blocks, block]);
  };

  const blockTypes = getAllBlocks();

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
          {form.blocks.map((block) => (
            <BlockEditor
              key={block.id}
              block={block}
              updateBlock={updateBlock}
              deleteBlock={deleteBlock}
              setBlockType={setBlockType}
            />
          ))}

          <div className="add-block">
            {blockTypes.map((b) => (
              <button key={b.type} onClick={() => addBlock(b.type)}>
                + {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
