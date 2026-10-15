import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { useState } from "react";
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
  const { items = [], emphasis = "key" } = block.props || {};
  const [linkOpen, setLinkOpen] = useState<number | null>(null);

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

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const reorderItems = (from: number, to: number) => {
    if (from === to) return;
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setProp("items", copy);
  };

  return (
    <div className="keyvalue-block-editor">
      <div className="keyvalue-block">
        {items.map((item: ItemType, i: number) => (
          <div
            key={i}
            className="keyvalue-row group relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) reorderItems(dragIndex, i);
              setDragIndex(null);
            }}
          >
            <span
              className="kv-drag-handle"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                setDragIndex(i);
              }}
              onDragEnd={() => setDragIndex(null)}
              title="drag to reorder"
            >
              ☰
            </span>
            <IconSelect
              dir="social"
              value={item.icon}
              onSelect={(icon) => updateItem(i, "icon", icon)}
            />

            <input
              className="keyvalue-block-key bg-transparent border-0 outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"
              placeholder="key"
              value={item.key}
              onChange={(e) => updateItem(i, "key", e.target.value)}
            />

            <input
              className="keyvalue-block-value bg-transparent border-0 outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"
              placeholder="value"
              value={item.value}
              onChange={(e) => updateItem(i, "value", e.target.value)}
            />

            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                className="text-indigo-500"
                title="set link"
                onClick={() =>
                  setLinkOpen((cur) => (cur === i ? null : i))
                }
              >
                🔗
              </button>

              <button
                className="item-remove-text"
                onClick={() => removeItem(i)}
              >
                ×
              </button>
            </div>

            {linkOpen === i && (
              <div className="absolute left-0 top-full mt-1 z-20 flex items-center gap-2 bg-white border border-indigo-200 rounded-lg shadow p-2">
                <input
                  className="text-input"
                  placeholder="link"
                  value={item.link === "https://" ? "" : item.link}
                  onChange={(e) =>
                    updateItem(i, "link", e.target.value)
                  }
                />
                {item.link ? (
                  <button
                    className="item-remove-text"
                    onClick={() => updateItem(i, "link", "")}
                  >
                    clear
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ))}

        <button className="item-add-button" onClick={addItem}>
          + Add Row
        </button>
      </div>

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
        items: [
          {
            key: "",
            value: "",
            icon: null,
            link: "",
          },
        ],
        emphasis: "key",
      },
    };
  },

  Editor: KeyValueEditor,
  Render: KeyValueRender,
});
