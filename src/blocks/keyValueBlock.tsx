import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";
import IconSelect from "../components/IconSelect";

type FieldType = "key" | "value" | "icon" | "link";
type ItemType = {
  key: string;
  value: string;
  icon: string | null;
  link: string;
};

interface KeyValueProps {
  block: {
    props: {
      items: ItemType[];
      emphasis: "key" | "value" | "none";
    };
  };
  update: (newBlock: any) => void;
}

export function KeyValueEditor({ block, update }: KeyValueProps) {
  const { items, emphasis = "key" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const updateItem = (index: number, field: FieldType, val: any) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: val };
    setProp("items", copy);
  };

  const addItem = () => {
    setProp("items", [...items, { key: "", value: "", link: "", icon: null }]);
  };

  const removeItem = (index: number) => {
    setProp(
      "items",
      items.filter((_: any, i: number) => i !== index),
    );
  };

  return (
    <div className="keyvalue-block-editor">
      <div className="input-list">
        {items.map((item: ItemType, i: number) => (
          <div key={i} className="input-row">
            <IconSelect
              dir="social"
              value={item.icon}
              onSelect={(icon) => updateItem(i, "icon", icon)}
            />

            <input
              className="text-input"
              placeholder="key"
              value={item.key}
              onChange={(e) => updateItem(i, "key", e.target.value)}
            />

            <input
              className="text-input"
              placeholder="value"
              value={item.value}
              onChange={(e) => updateItem(i, "value", e.target.value)}
            />
            {item.link == "" && (
              <button
                className="toggle-field"
                onClick={() => {
                  updateItem(i, "link", "https://");
                }}
              >
                🔗
              </button>
            )}

            {item.link != "" && (
              <input
                className="text-input"
                placeholder="link"
                onChange={(e) => updateItem(i, "link", e.target.value)}
              ></input>
            )}
            <button
              className="item-remove-button"
              onClick={() => removeItem(i)}
            >
              ×
            </button>
          </div>
        ))}

        <button className="item-add-button" onClick={addItem}>
          + Add Row
        </button>

        <AdvancedOptions block={block} update={update}>
          <div className="option-group">
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

export function KeyValueRender({ block }: KeyValueProps) {
  const { items = [], emphasis = "key" } = block.props || {};

  return (
    <div className={`keyvalue-block emphasize-${emphasis}`}>
      {items.map((item, i: number) => (
        <div key={i} className="keyvalue-row">
          {item.icon ? (
            <img src={item.icon} className="keyvalue-block-render-icon" />
          ) : (
            <div></div>
          )}

          <div className="keyvalue-block-key">{item.key}</div>
          <div className="keyvalue-block-value">
            {item.link != "" ? (
              <a href={item.link}>{item.value}</a>
            ) : (
              item.value
            )}
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
        items: [{ key: "", value: "", icon: null, link: "" }],
        emphasis: "key",
      },
    };
  },

  Editor: KeyValueEditor,
  Render: KeyValueRender,
});
