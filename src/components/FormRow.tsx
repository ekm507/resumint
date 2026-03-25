import type { ValueType, ValueTypeName } from "../utils/types";
import { GetDefaultValue } from "../utils/types";

interface Props {
  name: string;
  setName: (id: string, name: string) => void;
  value: ValueType;
  setValue: (id: string, value: ValueType) => void;
  id: string;
  valueType: ValueTypeName;
  setValueType: (id: string, value: ValueTypeName) => void;
  deleteSelf: (id: string) => void;
  className?: string;
}

export default function FormRow({
  name = "",
  setName,
  value = "",
  setValue,
  id,
  valueType,
  setValueType,
  deleteSelf,
  className = "",
}: Props) {
  let valueRender;
  if (valueType === "array") {
    valueRender = (
      <div className="ItamArray flex flex-col gap-1 border p-1">
        {(value as Array<string | number>).map((item, index) => (
          <input
            key={index}
            value={item as string | number}
            className="ItemArrayItem text-cyan-800 border"
            placeholder="string or number"
            onChange={(event) => {
              setValue(
                id,
                (value as Array<string | number>).map((item, i) =>
                  i === index ? event.target.value : item,
                ),
              );
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
        value={value as number}
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
        value={value as string}
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
        value={name}
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
              const type = e.target.value as ValueTypeName;
              setValueType(id, type);
              setValue(id, GetDefaultValue(type));
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
