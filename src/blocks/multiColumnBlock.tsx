import { registerBlock } from "./blockRegistry";
import BlockEditor from "../components/BlockEditor";
import BlockRenderer from "../components/BlockRenderer";
import AddBlockMenu from "../components/AddBlockMenu";
import type { Block } from "../utils/types";
import { useBlockOps } from "../hooks/useBlockOps";
import { Fragment } from "react/jsx-runtime";
import AdvancedOptions from "../components/AdvancedOptions";

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
      <AdvancedOptions block={block} update={update}>
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

          <input
            type="range"
            min={0}
            max={10}
            value={dividerWidth}
            onChange={(e) => setProp("dividerWidth", Number(e.target.value))}
          />
        </div>
      </AdvancedOptions>

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
                        blockType: "richtext",
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
  const dividerWidth = props.dividerWidth ?? 2;

  const template = columns
    .map((c, i) =>
      i === columns.length - 1 ? `${c.width}fr` : `${c.width}fr auto`,
    )
    .join(" ");

  return (
    <div
      className="resume-multi-column"
      style={{ gridTemplateColumns: template }}
    >
      {columns.map((col: Column, idx: number) => (
        <Fragment key={col.id}>
          <div className="resume-multi-column-content">
            {col.children?.map((child: Block) => (
              <BlockRenderer key={child.id} block={child} />
            ))}
          </div>

          {idx !== columns.length - 1 && (
            <div
              className={`resume-vertical-divider resume-divider-${dividerStyle}`}
              style={{ borderLeftWidth: dividerWidth + "px" }}
            />
          )}
        </Fragment>
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
