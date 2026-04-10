import { registerBlock } from "./blockRegistry";
import BlockEditor from "../components/BlockEditor";
import BlockRenderer from "../components/BlockRenderer";
import AddBlockMenu from "../components/AddBlockMenu";
import type { Block } from "../utils/types";
import { useBlockOps } from "../hooks/useBlockOps";

interface Column {
  id: string;
  width: number;
  children: Block[];
}

export function MultiColumnEditor({ block, update }: any) {
  const props = block.props || {};

  const columns: Column[] = props.columns || [
    { id: crypto.randomUUID(), width: 50, children: [] },
    { id: crypto.randomUUID(), width: 50, children: [] },
  ];

  const dividerStyle: string = props.dividerStyle || "solid";
  const dividerVisible: boolean = props.dividerVisible ?? true;
  const dividerWidth: number = props.dividerWidth ?? 2;

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const setColumns = (cols: Column[]) =>
    update({
      ...block,
      props: { ...(block.props || {}), columns: cols },
    });

  const updateColumn = (idx: number, newCol: Column) => {
    const newCols: Column[] = [...columns];
    newCols[idx] = newCol;
    setColumns(newCols);
  };

  const addColumn = () => {
    const next: Column[] = [
      ...columns,
      {
        id: crypto.randomUUID(),
        width: Math.round(100 / (columns.length + 1)),
        children: [],
      },
    ];

    setColumns(next);
  };

  const removeColumn = (idx: number) => {
    if (columns.length <= 1) return;

    const newCols: Column[] = columns.filter(
      (_col: Column, i: number) => i !== idx,
    );

    const per = Math.round(100 / newCols.length);

    setColumns(newCols.map((c: Column) => ({ ...c, width: per })));
  };

  return (
    <div className="multi-column-editor">
      <div className="multi-column-toolbar">
        <button onClick={addColumn}>+ column</button>

        <select
          value={dividerStyle}
          onChange={(e) => setProp("dividerStyle", e.target.value)}
        >
          <option value="solid">solid</option>
          <option value="dashed">dashed</option>
          <option value="dotted">dotted</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={dividerVisible}
            onChange={(e) => setProp("dividerVisible", e.target.checked)}
          />
          divider
        </label>

        <input
          type="range"
          min={1}
          max={10}
          value={dividerWidth}
          onChange={(e) => setProp("dividerWidth", Number(e.target.value))}
        />
      </div>

      <div className="multi-column-grid">
        {columns.map((col: Column, idx: number) => {
          const {
            updateBlock,
            deleteBlock,
            moveBlock,
            setBlockType,
            insertBlockAfter,
          } = useBlockOps(col.children, (children: Block[]) =>
            updateColumn(idx, { ...col, children }),
          );

          return (
            <div key={col.id} className="multi-column-column">
              <div className="multi-column-column-header">
                <span>Column {idx + 1}</span>

                {columns.length > 1 && (
                  <button onClick={() => removeColumn(idx)}>remove</button>
                )}
              </div>

              <div className="multi-column-items">
                {col.children.map((child: Block) => (
                  <div key={child.id}>
                    <BlockEditor
                      block={child}
                      updateBlock={updateBlock}
                      deleteBlock={deleteBlock}
                      moveUp={() => moveBlock(child.id, "up")}
                      moveDown={() => moveBlock(child.id, "down")}
                      setBlockType={setBlockType}
                    />

                    <AddBlockMenu
                      onSelect={(type: string) =>
                        insertBlockAfter(child.id, type)
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                className="multi-column-add-block"
                onClick={() =>
                  updateColumn(idx, {
                    ...col,
                    children: [
                      ...col.children,
                      {
                        id: crypto.randomUUID(),
                        blockType: "text",
                        props: { text: "" },
                      },
                    ],
                  })
                }
              >
                + add block
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MultiColumnRender({ block }: any) {
  const props = block.props || {};
  const columns: Column[] = props.columns || [];

  const dividerStyle = props.dividerStyle || "solid";
  const dividerVisible = props.dividerVisible ?? true;
  const dividerWidth = props.dividerWidth ?? 2;

  // Convert widths to a CSS grid template
  const template = columns.map((c) => `${c.width}fr`).join(" ");

  return (
    <div
      className="resume-multi-column"
      style={{ gridTemplateColumns: template }} // grid is safe
    >
      {columns.map((col: Column, idx: number) => (
        <div key={col.id} className="resume-multi-column-item">
          <div className="resume-multi-column-content">
            {col.children?.map((child: Block) => (
              <BlockRenderer key={child.id} block={child} />
            ))}
          </div>

          {dividerVisible && idx !== columns.length - 1 && (
            <div
              className={`resume-vertical-divider resume-divider-${dividerStyle}`}
              style={{ borderLeftWidth: dividerWidth + "px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

registerBlock({
  type: "multi-column",
  label: "Multi Column",

  create(): Block {
    return {
      id: "",
      blockType: "multi-column",
      props: {
        dividerStyle: "solid",
        dividerVisible: true,
        dividerWidth: 2,
        columns: [
          {
            id: crypto.randomUUID(),
            width: 50,
            children: [],
          },
          {
            id: crypto.randomUUID(),
            width: 50,
            children: [],
          },
        ],
      },
    };
  },

  Editor: MultiColumnEditor,
  Render: MultiColumnRender,
});

function MultiHandleSlider({ columns, updateColumns }) {
  const stops = columns.map((c, i) =>
    columns.slice(0, i + 1).reduce((a, b) => a + b.width, 0),
  );

  const onDrag = (index, value) => {
    const total = 100;

    const left = stops[index - 1] ?? 0;
    const right = stops[index + 1] ?? total;

    const clamped = Math.min(Math.max(value, left + 5), right - 5);

    const newWidths = [...columns];

    newWidths[index - 1].width = clamped - left;
    newWidths[index].width = right - clamped;

    updateColumns(newWidths);
  };

  return (
    <div className="multi-slider">
      {stops.slice(1, -1).map((stop, i) => (
        <input
          key={i}
          type="range"
          min={0}
          max={100}
          value={stop}
          onChange={(e) => onDrag(i + 1, Number(e.target.value))}
        />
      ))}
    </div>
  );
}
