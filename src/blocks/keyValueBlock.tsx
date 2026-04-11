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

  const updateItem = (index: number, field: "key" | "value", val: string) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: val };
    setProp("items", copy);
  };

  const addItem = () => {
    setProp("items", [...items, { key: "", value: "" }]);
  };

  const removeItem = (index: number) => {
    setProp(
      "items",
      items.filter((_: any, i: number) => i !== index),
    );
  };

  return (
    <div className="keyvalue-block-editor">
      <div className="keyvalue-list">
        {items.map((item: any, i: number) => (
          <div key={i} className="keyvalue-row">
            <input
              className="keyvalue-block-key-input"
              placeholder="key"
              value={item.key}
              onChange={(e) => updateItem(i, "key", e.target.value)}
            />

            <span className="keyvalue-block-separator">:</span>

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
          <div className="keyvalue-block-key">{item.key}</div>
          <div className="keyvalue-block-value">{item.value}</div>
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
        items: [{ key: "", value: "" }],
        emphasis: "key",
      },
    };
  },

  Editor: KeyValueEditor,
  Render: KeyValueRender,
});
