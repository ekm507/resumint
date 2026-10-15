import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { useState } from "react";
import { registerBlock } from "./blockRegistry";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

  return (
    <div className="keyvalue-block-editor">
      <DndContext
        sensors={useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;
          setProp("items", arrayMove([...items], Number(active.id), Number(over.id)));
        }}
      >
        <SortableContext
          items={items.map((_: ItemType, i: number) => String(i))}
          strategy={verticalListSortingStrategy}
        >
          <div className="keyvalue-block">
            {items.map((item: ItemType, i: number) => (
              <SortableKeyValueRow
                key={i}
                id={String(i)}
                item={item}
                isLinkOpen={linkOpen === i}
                toggleLink={() => setLinkOpen((cur) => (cur === i ? null : i))}
                updateItem={(field, value) => updateItem(i, field, value)}
                removeItem={() => removeItem(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
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
  );
}


function SortableKeyValueRow({
  id,
  item,
  isLinkOpen,
  toggleLink,
  updateItem,
  removeItem,
}: {
  id: string;
  item: ItemType;
  isLinkOpen: boolean;
  toggleLink: () => void;
  updateItem: (field: FieldType, value: any) => void;
  removeItem: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "none",
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div className="keyvalue-edit-row group relative" style={style} ref={setNodeRef}>
      <span
        className="kv-drag-handle"
        {...attributes}
        {...listeners}
        title="drag to reorder"
        style={{ cursor: "grab" }}
      >
        ☰
      </span>

      <IconSelect
        dir="social"
        value={item.icon}
        onSelect={(icon) => updateItem("icon", icon)}
      />

      <button
        className="opacity-0 group-hover:opacity-100 transition text-rose-600"
        title="remove item"
        onClick={removeItem}
      >
        ×
      </button>

      <input
        className="keyvalue-block-key bg-transparent border-0 outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1 min-w-0 flex-1"
        placeholder="key"
        value={item.key}
        onChange={(e) => updateItem("key", e.target.value)}
      />

      <button
        className="opacity-0 group-hover:opacity-100 transition text-indigo-500"
        title="set link"
        onClick={toggleLink}
      >
        🔗
      </button>

      <input
        className="keyvalue-block-value bg-transparent border-0 outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1 min-w-0 flex-1"
        placeholder="value"
        value={item.value}
        onChange={(e) => updateItem("value", e.target.value)}
      />

      {isLinkOpen && (
        <div className="absolute left-0 top-full mt-1 z-20 flex items-center gap-2 bg-white border border-indigo-200 rounded-lg shadow p-2">
          <input
            className="text-input"
            placeholder="link"
            value={item.link === "https://" ? "" : item.link}
            onChange={(e) =>
              updateItem("link", e.target.value)
            }
          />
          {item.link ? (
            <button
              className="item-remove-text"
              onClick={() => updateItem("link", "")}
            >
              clear
            </button>
          ) : null}
        </div>
      )}
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
