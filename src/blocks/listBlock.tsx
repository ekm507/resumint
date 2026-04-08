import { registerBlock } from "./blockRegistry";
import BlockEditor from "../components/BlockEditor";
import BlockRenderer from "../components/BlockRenderer";
import type { Block } from "../utils/types";

export function ListEditor({ block, update }: any) {
  const items = block.children || [];
  const { style = "ul" } = block.props || {};

  const setProp = (key: string, value: any) => {
    update({
      ...block,
      props: { ...block.props, [key]: value },
    });
  };

  const updateChild = (id: string, newChild: Block) => {
    update({
      ...block,
      children: items.map((c: Block) => (c.id === id ? newChild : c)),
    });
  };

  const deleteChild = (id: string) => {
    update({
      ...block,
      children: items.filter((c: Block) => c.id !== id),
    });
  };

  const setChildType = (id: string, type: string) => {
    update({
      ...block,
      children: items.map((c: Block) =>
        c.id === id
          ? { id: c.id, blockType: type, props: {}, children: [] }
          : c,
      ),
    });
  };

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
        <option value="ul">Bullet</option>
        <option value="ol">Numbered</option>
      </select>

      <div className="list-block-items">
        {items.map((child: Block) => (
          <div className="list-block-item" key={child.id}>
            <BlockEditor
              block={child}
              updateBlock={updateChild}
              deleteBlock={deleteChild}
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
        style: "ul",
      },
      children: [],
    };
  },

  Editor: ListEditor,
  Render: ListRender,
});
