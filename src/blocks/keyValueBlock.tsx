// src/blocks/keyValueBlock.tsx
import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";

export function KeyValueEditor({ block, update }: any) {
  const key = block.props?.key || "";
  const value = block.props?.value || "";

  const setProp = (field: "key" | "value", v: string) =>
    update({
      ...block,
      props: { ...(block.props || {}), [field]: v },
    });

  return (
    <div className="keyvalue-block-editor">
      <input
        className="keyvalue-block-key-input"
        placeholder="key"
        value={key}
        onChange={(e) => setProp("key", e.target.value)}
      />

      <span className="keyvalue-block-separator">:</span>

      <input
        className="keyvalue-block-value-input"
        placeholder="value"
        value={value}
        onChange={(e) => setProp("value", e.target.value)}
      />
    </div>
  );
}

export function KeyValueRender({ block }: any) {
  const key = block.props?.key || "";
  const value = block.props?.value || "";

  return (
    <div className="keyvalue-block">
      <p className="keyvalue-block-key">{key}</p>
      <div className="keyvalue-block-separator"></div>
      <p className="keyvalue-block-value">{value}</p>
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
        key: "",
        value: "",
      },
    };
  },

  Editor: KeyValueEditor,
  Render: KeyValueRender,
});
