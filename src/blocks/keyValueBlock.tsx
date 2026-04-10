import AdvancedOptions from "../components/AdvancedOptions";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function KeyValueEditor({ block, update }: any) {
  const { key = "", value = "", emphasis = "key" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  return (
    <div className="keyvalue-block-editor">
      {/* Basic Controls (Always Visible) */}
      <div className="keyvalue-main-inputs">
        <input
          placeholder="key"
          value={key}
          onChange={(e) => setProp("key", e.target.value)}
        />
        <span className="separator">:</span>
        <input
          placeholder="value"
          value={value}
          onChange={(e) => setProp("value", e.target.value)}
        />
      </div>

      {/* Advanced Options */}
      <AdvancedOptions block={block} update={update}>
        <div className="advanced-group"></div>

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
  );
}

export function KeyValueRender({ block }: any) {
  const { key, value, emphasis = "key" } = block.props || {};
  return (
    <div className={`keyvalue-block emphasize-${emphasis}`}>
      <span className="keyvalue-block-key">{key}</span>
      <span className="keyvalue-block-separator">:</span>
      <span className="keyvalue-block-value">{value}</span>
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
        emphasis: "key",
      },
    };
  },

  Editor: KeyValueEditor,
  Render: KeyValueRender,
});
