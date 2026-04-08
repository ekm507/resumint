import { registerBlock } from "./blockRegistry";
import BlockEditor from "../components/BlockEditor";
import BlockRenderer from "../components/BlockRenderer";
import type { Block } from "../utils/types";

export function VerticalSplitEditor({ block, update }: any) {
  const {
    dividerStyle = "solid",
    dividerVisible = true,
    dividerWidth = 2,
    ratio = "50-50",
  } = block.props || {};

  const left = block.left ?? {
    id: "",
    blockType: "text",
    props: { text: "" },
  };

  const right = block.right ?? {
    id: "",
    blockType: "text",
    props: { text: "" },
  };

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const updateLeft = (_: string, newChild: Block) =>
    update({ ...block, left: newChild });

  const updateRight = (_: string, newChild: Block) =>
    update({ ...block, right: newChild });

  const swap = () =>
    update({
      ...block,
      left: right,
      right: left,
    });

  const setLeftType = (_: string, type: string) =>
    update({
      ...block,
      left: { id: left.id, blockType: type, props: {} },
    });

  const setRightType = (_: string, type: string) =>
    update({
      ...block,
      right: { id: right.id, blockType: type, props: {} },
    });

  return (
    <div className="vertical-split-editor">
      <div className="flex gap-2 flex-wrap">
        <select
          value={ratio}
          onChange={(e) => setProp("ratio", e.target.value)}
        >
          <option value="50-50">50 / 50</option>
          <option value="30-70">30 / 70</option>
          <option value="70-30">70 / 30</option>
          <option value="40-60">40 / 60</option>
          <option value="60-40">60 / 40</option>
        </select>

        <select
          value={dividerStyle}
          onChange={(e) => setProp("dividerStyle", e.target.value)}
        >
          <option value="solid">solid</option>
          <option value="dashed">dashed</option>
          <option value="dotted">dotted</option>
        </select>

        <input
          type="range"
          min={1}
          max={10}
          value={dividerWidth}
          onChange={(e) => setProp("dividerWidth", Number(e.target.value))}
        />

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={dividerVisible}
            onChange={(e) => setProp("dividerVisible", e.target.checked)}
          />
          divider
        </label>

        <button onClick={swap}>swap</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <BlockEditor
          block={left}
          updateBlock={updateLeft}
          deleteBlock={() => {}}
          setBlockType={setLeftType}
        />

        <BlockEditor
          block={right}
          updateBlock={updateRight}
          deleteBlock={() => {}}
          setBlockType={setRightType}
        />
      </div>
    </div>
  );
}

export function VerticalSplitRender({ block }: any) {
  const {
    dividerStyle = "solid",
    dividerVisible = true,
    dividerWidth = 2,
    ratio = "50-50",
  } = block.props || {};

  const [l, r] = ratio.split("-");

  return (
    <div className="resume-vertical-split flex items-stretch">
      <div style={{ width: `${l}%` }}>
        <BlockRenderer block={block.left} />
      </div>

      {dividerVisible && (
        <div
          className={`resume-vertical-divider resume-divider-${dividerStyle}`}
          style={{ borderLeftWidth: `${dividerWidth}px` }}
        />
      )}

      <div style={{ width: `${r}%` }}>
        <BlockRenderer block={block.right} />
      </div>
    </div>
  );
}

registerBlock({
  type: "vertical-split",
  label: "Vertical Split",

  create(): Block {
    return {
      id: "",
      blockType: "vertical-split",
      props: {
        dividerStyle: "solid",
        dividerVisible: true,
        dividerWidth: 2,
        ratio: "50-50",
      },
      left: {
        id: crypto.randomUUID(),
        blockType: "text",
        props: { text: "" },
      },
      right: {
        id: crypto.randomUUID(),
        blockType: "text",
        props: { text: "" },
      },
    };
  },

  Editor: VerticalSplitEditor,
  Render: VerticalSplitRender,
});
