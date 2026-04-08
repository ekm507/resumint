import type { ChangeEvent } from "react";
import type { Block, BlockType } from "../utils/types";
import { BlockTypesList } from "../utils/types";

interface Props {
  block: Block;
  updateBlock: (id: string, props: any) => void;
  deleteBlock: (id: string) => void;
  setBlockType: (id: string, type: BlockType) => void;
}

export default function BlockEditor({
  block,
  updateBlock,
  deleteBlock,
  setBlockType,
}: Props) {
  const { id, blockType, props, children } = block;

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateBlock(id, { src: reader.result });
    };

    reader.readAsDataURL(file);
  }

  function renderInput() {
    switch (blockType) {
      case "text":
        return (
          <input
            className="editor-input editor-input-string"
            value={props?.text || ""}
            onChange={(e) => updateBlock(id, { text: e.target.value })}
            placeholder="text"
          />
        );

      case "heading":
        return (
          <input
            className="editor-input editor-input-string"
            value={props?.text || ""}
            onChange={(e) => updateBlock(id, { text: e.target.value })}
            placeholder="heading"
          />
        );

      case "link":
        return (
          <>
            <input
              className="editor-input"
              placeholder="text"
              value={props?.text || ""}
              onChange={(e) =>
                updateBlock(id, { ...props, text: e.target.value })
              }
            />

            <input
              className="editor-input"
              placeholder="url"
              value={props?.url || ""}
              onChange={(e) =>
                updateBlock(id, { ...props, url: e.target.value })
              }
            />
          </>
        );

      case "image":
        return (
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        );

      case "divider":
        return <div className="editor-divider">divider</div>;

      case "list":
        return (
          <div className="editor-array">
            {children?.map((child) => (
              <input
                key={child.id}
                className="editor-input"
                value={child.props?.text || ""}
                onChange={(e) =>
                  updateBlock(child.id, { text: e.target.value })
                }
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="editor-row">
      <div className="editor-row-left">
        <button
          type="button"
          className="editor-row-delete"
          onClick={() => deleteBlock(id)}
        >
          🗑️
        </button>
      </div>

      <div className="editor-row-right">
        <select
          value={blockType}
          className="editor-row-type"
          onChange={(e) => setBlockType(id, e.target.value as BlockType)}
        >
          {BlockTypesList.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {renderInput()}
      </div>
    </div>
  );
}
