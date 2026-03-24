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
      const lastRow = prev[prev.length - 1];
      const lastID = lastRow ? Number(lastRow.rowID) : -1; // start at -1 so next becomes 0
      const lastValueType = lastRow ? lastRow.valueType : "string";
      return [
        ...prev,
        { rowID: lastID + 1, name: "", value: "", valueType: lastValueType },
      ];
    });
  }

  function deleteRow(rowID: number) {
    setRowData((prev) => prev.filter((item) => item.rowID !== rowID));
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
          deleteSelf={deleteRow}
        />
      ))}
      <button onClick={addRow}>+</button>
    </div>
  );
}
