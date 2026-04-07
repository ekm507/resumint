import type { ValueType, ValueTypeName } from "../utils/types";
import ArrayItem from "./ArrayItem";

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
    const lastId = +(arr[arr.length - 1]?.id ?? -1);
    const newId = String(lastId + 1);
    arr.push({ id: newId, value: "" });
    setValue(id, arr);
  }

  function setArrayValue(arrayId: string, arrayValue: string) {
    const newArray = (value as { id: string; value: string }[]).map((item) =>
      item.id === arrayId ? { id: arrayId, value: arrayValue } : item,
    );
    setValue(id, newArray);
  }

  function deleteArrayItem(arrayId: string) {
    setValue(
      id,
      (value as { id: string; value: string }[]).filter(
        (item) => item.id !== arrayId,
      ),
    );
  }

  function renderValueInput() {
    switch (valueType) {
      case "array":
        return (
          <div className="editor-array">
            {(value as { id: string; value: string }[])?.map((item) => (
              <ArrayItem
                value={item.value}
                key={item.id}
                id={item.id}
                setValue={setArrayValue}
                deleteSelf={deleteArrayItem}
              />
            ))}

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
          {ValueTypesList.map((type) => (
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
