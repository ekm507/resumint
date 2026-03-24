import { useState } from "react";

interface Props {
  setName: (rowID: string | number, name: string) => void;
  setValue: (
    rowID: string | number,
    value: number | string | Array<string | number>,
  ) => void;
  rowID: string | number;
  className?: string;
}

export default function FormRow({
  setName,
  setValue,
  rowID,
  className = "",
}: Props) {
  const [valueType, setValueType] = useState("string");
  const value = [""] as Array<string | number>;
  let valueRender;
  if (valueType === "array") {
    valueRender = (
      <div className="ItamArray flex flex-col gap-1 border p-1">
        {value.map((_, index) => (
          <input
            key={index}
            className="ItemArrayItem text-cyan-800 border"
            placeholder="string or number"
            onChange={(event) => {
              value[index] = event.target.value;
              setValue(rowID, value);
            }}
          />
        ))}
      </div>
    );
  } else if (valueType === "number") {
    valueRender = (
      <input
        key="value"
        type="number"
        placeholder="numberic value"
        className="ItemString text-amber-800 border p-1"
        onChange={(event) => {
          setValue(rowID, event.target.value);
        }}
      />
    );
  } else if (valueType === "string") {
    valueRender = (
      <input
        key="value"
        placeholder="string value"
        className="ItemString text-blue-800 border p-1"
        onChange={(event) => {
          setValue(rowID, event.target.value);
        }}
      />
    );
  }
  return (
    <div
      className={"ItemRow flex flex-row gap-1 p-1 border " + " " + className}
    >
      <input
        key="name"
        placeholder="item name"
        className="itemName border p-1"
        onChange={(e) => {
          setName(rowID, e.target.value);
        }}
      />
      {valueRender}
    </div>
  );
}
