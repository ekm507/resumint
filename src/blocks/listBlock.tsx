import { registerBlock } from "./blockRegistry";
import BlockEditor from "../components/BlockEditor";
import BlockRenderer from "../components/BlockRenderer";
import type { Block } from "../utils/types";
import { useBlockOps } from "../hooks/useBlockOps";

export function ListEditor({ block, update }: any) {
  const items = block.children || [];
  const setChildren = (children: Block[]) => update({ ...block, children });

  const {
    updateBlock: updateChild,
    deleteBlock: deleteChild,
    moveBlock,
    insertBlockAfter,
    setBlockType: setChildType,
  } = useBlockOps(items, setChildren);
  const { style = "ul" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const addItem = () => {
    update({
      ...block,
      children: [
        ...items,
        {
          id: crypto.randomUUID(),
          blockType: "text",
          props: { text: "" },
        },
      ],
    });
  };

  return (
    <div className="list-block-editor">
      <select
        className="list-block-style-select"
        value={style}
        onChange={(e) => setProp("style", e.target.value)}
      >
        <option value="plain">Plain</option>
        <option value="bullet">Bullet</option>
        <option value="numbered">Numbered</option>
      </select>

      <div className="list-block-items">
        {items.map((child: Block) => (
          <div className="list-block-item" key={child.id}>
            <BlockEditor
              block={child}
              updateBlock={updateChild}
              deleteBlock={deleteChild}
              moveUp={() => moveBlock(child.id, "up")}
              moveDown={() => moveBlock(child.id, "down")}
              insertBlockAfter={insertBlockAfter}
              setBlockType={setChildType}
            />
          </div>
        ))}
      </div>

      <button className="list-block-add-button" onClick={addItem}>
        + item
      </button>
    </div>
  );
}

export function ListRender({ block }: any) {
  const { style = "ul" } = block.props || {};
  const Tag = style === "ol" ? "ol" : "ul";

  return (
    <Tag className={`list-block list-style-${style}`}>
      {block.children?.map((child: Block) => (
        <li className="list-block-render-item" key={child.id}>
          <BlockRenderer block={child} />
        </li>
      ))}
    </Tag>
  );
}

registerBlock({
  type: "list",
  label: "List",

  create(): Block {
    return {
      id: "",
      blockType: "list",
      props: {
        style: "plain",
      },
      children: [],
    };
  },

  Editor: ListEditor,
  Render: ListRender,
});
