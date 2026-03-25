import type { ValueType, ValueTypeName } from "../utils/types";

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
  function renderValueInput() {
    switch (valueType) {
      case "array":
        return (
          <div className="ItamArray flex flex-col gap-1 border p-1">
            {(value as Array<string | number>).map((item, index) => (
              <input
                key={index}
                value={item}
                className="ItemArrayItem text-cyan-800 border"
                placeholder="string or number"
                onChange={(e) => {
                  const newArray = [...(value as Array<string | number>)];
                  newArray[index] = e.target.value;
                  setValue(id, newArray);
                }}
              />
            ))}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value as number}
            placeholder="numeric value"
            className="ItemString text-amber-800 border p-1"
            onChange={(e) => setValue(id, Number(e.target.value))}
          />
        );

      case "string":
      default:
        return (
          <input
            value={value as string}
            placeholder="string value"
            className="ItemString text-blue-800 border p-1"
            onChange={(e) => setValue(id, e.target.value)}
          />
        );
    }
  }

  function handleTypeChange(type: ValueTypeName) {
    setValueType(id, type);
  }

  return (
    <div className={`ItemRow flex flex-row gap-1 p-1 border ${className}`}>
      <button onClick={() => deleteSelf(id)}>🗑️</button>

      <input
        value={name}
        placeholder="item name"
        className="itemName border p-1"
        onChange={(e) => setName(id, e.target.value)}
      />

      <div className="flex flex-row">
        <select
          value={valueType}
          className="cursor-pointer border rounded"
          onChange={(e) => handleTypeChange(e.target.value as ValueTypeName)}
        >
          {["string", "number", "array"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {renderValueInput()}
      </div>
    </div>
  );
}
