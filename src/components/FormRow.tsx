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
  function addArrayItem() {
    const arr = Array.isArray(value) ? [...value] : [];
    arr.push("");
    setValue(id, arr);
  }

  function removeIndex(index: number) {
    if (!Array.isArray(value)) return;
    const arr = [...value];
    arr.splice(index, 1);
    setValue(id, arr);
  }

  function renderValueInput() {
    switch (valueType) {
      case "array":
        return (
          <div className="editor-array">
            {(value as Array<string | number>)?.map((item, index) => (
              <div className="editor-array-item-wrapper" key={index}>
                <input
                  value={item}
                  className="editor-array-item"
                  placeholder="string or number"
                  onChange={(e) => {
                    const newArray = [...(value as Array<string | number>)];
                    newArray[index] = e.target.value;
                    setValue(id, newArray);
                  }}
                />

                <button
                  type="button"
                  className="editor-array-remove"
                  onClick={() => removeIndex(index)}
                >
                  ❌
                </button>
              </div>
            ))}

            {/* ADD NEW ARRAY ITEM BUTTON */}
            <button
              type="button"
              className="editor-array-add"
              onClick={addArrayItem}
            >
              ＋ Add item
            </button>
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value as number}
            placeholder="numeric value"
            className="editor-input editor-input-number"
            onChange={(e) => setValue(id, Number(e.target.value))}
          />
        );

      case "string":
      default:
        return (
          <input
            value={value as string}
            placeholder="string value"
            className="editor-input editor-input-string"
            onChange={(e) => setValue(id, e.target.value)}
          />
        );
    }
  }

  function handleTypeChange(type: ValueTypeName) {
    setValueType(id, type);
  }

  return (
    <div className={`editor-row ${className}`}>
      <div className="editor-row-left">
        <button
          type="button"
          className="editor-row-delete"
          onClick={() => deleteSelf(id)}
        >
          🗑️
        </button>

        <input
          value={name}
          placeholder="item name"
          className="editor-row-name"
          onChange={(e) => setName(id, e.target.value)}
        />
      </div>

      <div className="editor-row-right">
        <select
          value={valueType}
          className="editor-row-type"
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
