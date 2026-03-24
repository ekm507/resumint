import type { ValueType, ValueTypeName } from "../utils/types";

interface Props {
  setName: (id: string, name: string) => void;
  setValue: (id: string, value: ValueType) => void;
  id: string;
  valueType: ValueTypeName;
  setValueType: (id: string, value: ValueTypeName) => void;
  deleteSelf: (id: string) => void;
  className?: string;
}

export default function FormRow({
  setName,
  setValue,
  id,
  valueType,
  setValueType,
  deleteSelf,
  className = "",
}: Props) {
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
              setValue(id, value);
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
          setValue(id, event.target.value);
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
          setValue(id, event.target.value);
        }}
      />
    );
  }
  return (
    <div
      className={"ItemRow flex flex-row gap-1 p-1 border " + " " + className}
    >
      <button onClick={() => deleteSelf(id)}>🗑️</button>
      <input
        key="name"
        placeholder="item name"
        className="itemName border p-1"
        onChange={(e) => {
          setName(id, e.target.value);
        }}
      />
      <div className="flex flex-row">
        <div className="relative inline-block">
          <select
            value={valueType}
            className="w-8 h-8 appearance-none text-transparent cursor-pointer border rounded"
            onChange={(e) => {
              setValueType(id, e.target.value as "string" | "number" | "array");
            }}
          >
            {["string", "number", "array"].map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span className="absolute inset-0 pointer-events-none">
            {{ array: 0, number: 1, string: 2 }[valueType]}▼
          </span>
        </div>

        {valueRender}
      </div>
    </div>
  );
}
