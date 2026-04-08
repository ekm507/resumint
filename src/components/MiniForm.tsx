import BlockEditor from "./BlockEditor";
import type { FormStructure, Block, BlockType } from "../utils/types";
import { useState } from "react";

interface Prop {
  form: FormStructure;
  onFormChange: (id: string, newForm: FormStructure) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export default function MiniForm({
  form,
  onFormChange,
  onDelete,
  className = "",
}: Prop) {
  const { id, title, blocks } = form;

  function updateBlocks(newBlocks: Block[]) {
    onFormChange(id, { ...form, blocks: newBlocks });
  }

  function updateBlock(blockId: string, props: any) {
    updateBlocks(
      blocks.map((b) =>
        b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b,
      ),
    );
  }

  function setBlockType(blockId: string, type: BlockType) {
    updateBlocks(
      blocks.map((b) => (b.id === blockId ? { ...b, type, props: {} } : b)),
    );
  }

  function deleteBlock(blockId: string) {
    updateBlocks(blocks.filter((b) => b.id !== blockId));
  }

  function setTitle(title: string) {
    onFormChange(id, { ...form, title });
  }

  function addBlock() {
    const last = blocks[blocks.length - 1];
    const lastId = last ? +last.id : -1;

    const newBlock: Block = {
      id: String(lastId + 1),
      blockType: "text",
      props: { text: "" },
    };

    updateBlocks([...blocks, newBlock]);
  }

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`editor-form ${className}`}>
      <div className="editor-form-header">
        <button className="editor-form-delete" onClick={() => onDelete(id)}>
          ❌
        </button>

        <button
          className={`editor-form-collapse ${collapsed ? "collapsed" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          ▼
        </button>

        <input
          className="editor-form-title"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={`editor-form-body ${collapsed ? "collapsed" : ""}`}>
        <div className="editor-form-rows">
          {blocks.map((block) => (
            <BlockEditor
              key={block.id}
              block={block}
              updateBlock={updateBlock}
              deleteBlock={deleteBlock}
              setBlockType={setBlockType}
            />
          ))}
        </div>

        <button className="editor-row-add" onClick={addBlock}>
          +
        </button>
      </div>
    </div>
  );
}
