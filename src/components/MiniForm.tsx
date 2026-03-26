import FormRow from "./FormRow";
import {
  type ValueTypeName,
  type FormStructure,
  type Row,
  GetDefaultValue,
} from "../utils/types";
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
  const { id, title, content } = form;

  function updateContent(newContent: Row[]) {
    onFormChange(id, { ...form, content: newContent });
  }

  function setName(rowId: string, name: string) {
    updateContent(
      content.map((row) => (row.id === rowId ? { ...row, name } : row)),
    );
  }
  function setValue(
    rowId: string,
    value: number | string | Array<string | number>,
  ) {
    updateContent(
      content.map((row) => (row.id === rowId ? { ...row, value } : row)),
    );
  }

  function setValueType(rowId: string, valueType: ValueTypeName) {
    updateContent(
      content.map((row) =>
        row.id === rowId
          ? { ...row, valueType, value: GetDefaultValue(valueType) }
          : row,
      ),
    );
  }

  function setTitle(title: string) {
    onFormChange(id, { ...form, title });
  }

  function addRow() {
    const lastRow = content[content.length - 1];
    const lastID = lastRow ? +lastRow.id : -1;
    const lastValueType = lastRow
      ? (lastRow.valueType as ValueTypeName)
      : ("string" as ValueTypeName);
    updateContent([
      ...content,
      {
        id: String(lastID + 1),
        name: "",
        value: GetDefaultValue(lastValueType),
        valueType: lastValueType,
      },
    ]);
  }

  function deleteRow(rowId: string) {
    updateContent(content.filter((item) => item.id !== rowId));
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
          {content.map((item) => (
            <FormRow
              key={item.id}
              id={item.id}
              name={item.name}
              value={item.value}
              setName={setName}
              setValue={setValue}
              valueType={item.valueType ? item.valueType : "string"}
              setValueType={setValueType}
              deleteSelf={deleteRow}
            />
          ))}
        </div>

        <button className="editor-row-add" onClick={addRow}>
          +
        </button>
      </div>
    </div>
  );
}
