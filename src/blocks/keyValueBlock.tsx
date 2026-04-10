import AdvancedOptions from "../components/AdvancedOptions";
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
              placeholder="key"
              value={item.key}
              onChange={(e) => updateItem(i, "key", e.target.value)}
            />

            <span className="separator">:</span>

            <input
              placeholder="value"
              value={item.value}
              onChange={(e) => updateItem(i, "value", e.target.value)}
            />

            <button onClick={() => removeItem(i)}>×</button>
          </div>
        ))}

        <button onClick={addItem}>+ Add Row</button>
        <AdvancedOptions block={block} update={update}>
          <div className="advanced-group">
            <label>Emphasis</label>
            <select
              value={emphasis}
              onChange={(e) => setProp("emphasis", e.target.value)}
            >
              <option value="none">Normal</option>
              <option value="key">Bold Key</option>
              <option value="value">Bold Value</option>
            </select>
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
          <span className="keyvalue-block-key">{item.key}</span>
          <span className="keyvalue-block-separator">:</span>
          <span className="keyvalue-block-value">{item.value}</span>
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
