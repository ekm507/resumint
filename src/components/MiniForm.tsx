import { useState } from "react";
import FormRow from "./FormRow";
import type { ValueTypeName, FormStructure, Row } from "../utils/types";
interface Prop {
  initialForm?: Partial<FormStructure>;
  onFormChange?: (newForm: FormStructure) => void;
  className?: string;
}

export default function MiniForm({
  initialForm,
  onFormChange,
  className = "",
}: Prop) {
  const initialRowData = initialForm
    ? initialForm.content
    : ([{ id: "0", name: "", value: "", valueType: "string" }] as Row[]);
  const [rowData, setRowData] = useState(initialRowData as Row[]);

  function setName(id: string, name: string) {
    setRowData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              name,
            }
          : row,
      ),
    );
  }
  function setValue(
    id: string,
    value: number | string | Array<string | number>,
  ) {
    setRowData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              value,
            }
          : row,
      ),
    );
  }

  function setValueType(id: string, valueType: ValueTypeName) {
    setRowData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, valueType } : row)),
    );
  }

  function addRow() {
    setRowData((prev) => {
      const lastRow = prev[prev.length - 1];
      const lastID = lastRow ? +lastRow.id : -1;
      const lastValueType = lastRow ? lastRow.valueType : "string";
      return [
        ...prev,
        {
          id: String(lastID + 1),
          name: "",
          valueType: lastValueType,
        },
      ];
    });
  }

  function deleteRow(id: string) {
    setRowData((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className={"border flex flex-col gap-2" + " " + className}>
      <p className="border p-1">this is a form</p>
      {rowData.map((item) => (
        <FormRow
          key={item.id}
          id={item.id}
          name={item.name}
          value={item.value}
          setName={setName}
          setValue={setValue}
          valueType={item.valueType}
          setValueType={setValueType}
          deleteSelf={deleteRow}
        />
      ))}
      <button onClick={addRow}>+</button>
    </div>
  );
}
