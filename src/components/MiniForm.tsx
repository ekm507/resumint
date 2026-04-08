// src/components/MiniForm.tsx
import { useState } from "react";
import type { FormStructure } from "../utils/types";
import { useFormEditor } from "../hooks/useFormEditor";
import BlockList from "./BlockList";

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
  const [collapsed, setCollapsed] = useState(false);

  const {
    title,
    blocks,
    setTitle,
    updateBlock,
    deleteBlock,
    setBlockType,
    addBlock,
  } = useFormEditor(form, onFormChange);

  return (
    <div className={`editor-form ${className}`}>
      <div className="editor-form-header">
        <button
          className="editor-form-delete"
          onClick={() => onDelete(form.id)}
        >
          ❌
        </button>

        <button
          className={`editor-form-collapse ${collapsed ? "collapsed" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand" : "Collapse"}
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
        <BlockList
          blocks={blocks}
          updateBlock={updateBlock}
          deleteBlock={deleteBlock}
          setBlockType={setBlockType}
        />

        <button className="editor-row-add" onClick={addBlock}>
          +
        </button>
      </div>
    </div>
  );
}
