import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function KeyValueEditor({ block, update }: any) {
  const { items = [], emphasis = "key" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const updateItem = (
    index: number,
    field: "key" | "value" | "icon",
    val: any,
  ) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: val };
    setProp("items", copy);
  };

  const addItem = () => {
    setProp("items", [...items, { key: "", value: "", icon: null }]);
  };

  const removeItem = (index: number) => {
    setProp(
      "items",
      items.filter((_: any, i: number) => i !== index),
    );
  };

  const onUploadIcon = (index: number, file: File | null) => {
    if (!file) {
      updateItem(index, "icon", null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateItem(index, "icon", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="keyvalue-block-editor">
      <div className="keyvalue-list">
        {items.map((item: any, i: number) => (
          <div key={i} className="keyvalue-input-row">
            <div className="keyvalue-icon-column">
              {item.icon ? (
                <div className="keyvalue-icon-preview">
                  <img
                    src={item.icon}
                    alt="icon"
                    className="keyvalue-icon-img"
                  />
                  <button
                    className="keyvalue-icon-remove"
                    onClick={() => updateItem(i, "icon", null)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  className="keyvalue-icon-input"
                  onChange={(e) => onUploadIcon(i, e.target.files?.[0] || null)}
                />
              )}
            </div>
            <input
              className="keyvalue-block-key-input"
              placeholder="key"
              value={item.key}
              onChange={(e) => updateItem(i, "key", e.target.value)}
            />

            <input
              className="keyvalue-block-value-input"
              placeholder="value"
              value={item.value}
              onChange={(e) => updateItem(i, "value", e.target.value)}
            />
            <button
              className="item-remove-button"
              onClick={() => removeItem(i)}
            >
              ×
            </button>
          </div>
        ))}

        <button className="keyvalue-add-button" onClick={addItem}>
          + Add Row
        </button>

        <AdvancedOptions block={block} update={update}>
          <div className="advanced-group">
            <label>Emphasis</label>
            <ToggleButton
              value={emphasis}
              onChange={(v) => setProp("emphasis", v)}
              options={[
                { value: "none", label: "Normal" },
                { value: "key", label: "Bold Key" },
                { value: "value", label: "Bold Value" },
              ]}
            />
          </div>
        </AdvancedOptions>
      </div>
    </div>
  );
}

export function KeyValueRender({ block }: any) {
  const { items = [], emphasis = "key" } = block.props || {};

  return (
    <div className={`keyvalue-block emphasize-${emphasis}`}>
      {items.map((item: any, i: number) => (
        <div key={i} className="keyvalue-row">
          <div className="keyvalue-block-key-icon-container">
            {item.icon ? (
              <img src={item.icon} className="keyvalue-block-render-icon" />
            ) : null}

            <div className="keyvalue-block-key">{item.key}</div>
            <div className="keyvalue-block-value">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

registerBlock({
  type: "keyValue",
  label: "Key / Value",

  create(): Block {
    return {
      id: "",
      blockType: "keyValue",
      props: {
        items: [{ key: "", value: "", icon: null }],
        emphasis: "key",
      },
    };
  },

  Editor: KeyValueEditor,
  Render: KeyValueRender,
});
