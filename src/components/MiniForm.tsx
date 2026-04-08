import { useState } from "react";
import type { FormStructure, Block } from "../utils/types";
import BlockEditor from "./BlockEditor";
import { getBlock } from "../blocks/blockRegistry";

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

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = form.blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    const newBlocks = [...form.blocks];

    if (direction === "up" && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
    }

    if (direction === "down" && index < newBlocks.length - 1) {
      [newBlocks[index + 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index + 1],
      ];
    }

    updateBlocks(newBlocks);
  };

  const insertBlockAfter = (id: string, type: string) => {
    const index = form.blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    const def = getBlock(type);
    if (!def) return;

    const newBlock = { ...def.create(), id: crypto.randomUUID() };

    const newBlocks = [...form.blocks];
    newBlocks.splice(index + 1, 0, newBlock);

    updateBlocks(newBlocks);
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
            ...b.props,
          },
        };
      }),
    );
  };

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
              moveUp={() => moveBlock(block.id, "up")}
              moveDown={() => moveBlock(block.id, "down")}
              insertBlockAfter={insertBlockAfter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
