import { registerBlock } from "./blockRegistry";
import type { Block } from "../utils/types";
import BlockEditor from "../components/BlockEditor";

export function ListEditor({ block, update }: any) {
  const items = block.children || [];

  const updateChild = (childId: string, newChild: Block) => {
    update({
      ...block,
      children: items.map((c: Block) => (c.id === childId ? newChild : c)),
    });
  };

  const deleteChild = (childId: string) => {
    update({
      ...block,
      children: items.filter((c: Block) => c.id !== childId),
    });
  };

  const setChildType = (childId: string, type: string) => {
    update({
      ...block,
      children: items.map((c: Block) =>
        c.id === childId
          ? {
              id: c.id,
              blockType: type,
              props: {},
              children: [],
            }
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
    <div className="list-editor">
      {items.map((child: Block) => (
        <BlockEditor
          key={child.id}
          block={child}
          updateBlock={updateChild}
          deleteBlock={deleteChild}
          setBlockType={setChildType}
        />
      ))}

      <button onClick={addItem}>+ item</button>
    </div>
  );
}

export function ListRender({ block }: any) {
  return (
    <ul>
      {block.children?.map((child: Block) => (
        <li key={child.id}>{child.props?.text}</li>
      ))}
    </ul>
  );
}

registerBlock({
  type: "list",
  label: "List",

  create(): Block {
    return {
      id: "",
      blockType: "list",
      props: {},
      children: [],
    };
  },

  Editor: ListEditor,
  Render: ListRender,
});
