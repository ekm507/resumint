import { useState } from "react";
import FormRow from "./FormRow";

interface Prop {
  className?: string;
}

export default function MiniForm({ className = "" }: Prop) {
  type Row = {
    [rowID: string]: {
      name: string;
      value: string | number | Array<string | number>;
    };
  };
  const [rowData, setRowData] = useState<Row[]>([
    { ["rowID"]: { name: "", value: "" } },
  ]);

  function setName(rowID: string | number, name: string) {
    setRowData((prev) =>
      prev.map((row) =>
        row[rowID]
          ? {
              ...row,
              [rowID]: { ...row[rowID], name },
            }
          : row,
      ),
    );
  }
  function setValue(
    rowID: string | number,
    value: number | string | Array<string | number>,
  ) {
    setRowData((prev) =>
      prev.map((row) =>
        row[rowID]
          ? {
              ...row,
              [rowID]: { ...row[rowID], value },
            }
          : row,
      ),
    );
  }

  return (
    <div className={"border flex flex-col gap-2" + " " + className}>
      <p className="border p-1">this is a form</p>
      {rowData.map((_, rowID) => (
        <FormRow
          key={rowID}
          rowID={rowID}
          setName={setName}
          setValue={setValue}
        />
      ))}
    </div>
  );
}
