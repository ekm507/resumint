import { useState } from "react";
import FormRow from "./FormRow";

interface Prop {
  className?: string;
}

export default function MiniForm({ className = "" }: Prop) {
  type Row = {
    rowID: number;
    name: string;
    valueType: "string" | "number" | "array";
    value: string | number | Array<string | number>;
  };
  const [rowData, setRowData] = useState<Row[]>([
    { rowID: 0, name: "", value: "", valueType: "string" },
  ]);

  function setName(rowID: number | number, name: string) {
    setRowData((prev) =>
      prev.map((row) =>
        row.rowID === rowID
          ? {
              ...row,
              name,
            }
          : row,
      ),
    );
  }
  function setValue(
    rowID: number,
    value: number | string | Array<string | number>,
  ) {
    setRowData((prev) =>
      prev.map((row) =>
        row.rowID === rowID
          ? {
              ...row,
              value,
            }
          : row,
      ),
    );
  }

  function setValueType(
    rowID: number,
    valueType: "string" | "number" | "array",
  ) {
    setRowData((prev) =>
      prev.map((row) => (row.rowID === rowID ? { ...row, valueType } : row)),
    );
  }

  function addRow() {
    setRowData((prev) => {
      const last = prev[prev.length - 1].rowID;
      const lastValueType = prev[prev.length - 1].valueType;
      return [
        ...prev,
        { rowID: last + 1, name: "", value: "", valueType: lastValueType },
      ];
    });
  }

  return (
    <div className={"border flex flex-col gap-2" + " " + className}>
      <p className="border p-1">this is a form</p>
      {rowData.map((item, rowID) => (
        <FormRow
          key={rowID}
          rowID={rowID}
          setName={setName}
          setValue={setValue}
          valueType={item.valueType}
          setValueType={setValueType}
        />
      ))}
      <button onClick={addRow}>+</button>
    </div>
  );
}
