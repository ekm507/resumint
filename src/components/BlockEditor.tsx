import { getBlock, getAllBlocks } from "../blocks/blockRegistry";
import type { Block } from "../utils/types";
import { useI18n } from "../i18nContext";

interface Props {
  block: Block;
  updateBlock: (id: string, block: Block) => void;
  deleteBlock: (id: string) => void;
  setBlockType: (id: string, type: string) => void;
  moveUp: () => void;
  moveDown: () => void;
  autoFocus?: boolean;
}

export default function BlockEditor({
  block,
  updateBlock,
  deleteBlock,
  setBlockType,
  moveUp,
  moveDown,
  autoFocus = true,
}: Props) {
  const { t } = useI18n();

  if (!block) {
    return <div className="block-editor-error">{t("block.missing")}</div>;
  }

  const def = getBlock(block.blockType);
  const blocks = getAllBlocks();

  if (!def) {
    return (
      <div className="block-editor-error">{t("block.unknown")} {block.blockType}</div>
    );
  }

  const Editor = def.Editor;

  return (
    <div className="block-editor">
      <div className="block-editor-header">
        {!block.isTemplate && (
          <select
            className="block-type-select"
            value={block.blockType}
            onChange={(e) => setBlockType(block.id, e.target.value)}
          >
            {blocks.map((b) => (
              <option key={b.type} value={b.type}>
                {t(b.label)}
              </option>
            ))}
          </select>
        )}
      </div>

      {!block.isTemplate && (
        <div className="block-hover-controls">
          <button
            className="block-hover-button"
            onClick={moveUp}
            title={t("block.moveUp")}
          >
            ↑
          </button>

          <button
            className="block-hover-button"
            onClick={moveDown}
            title={t("block.moveDown")}
          >
            ↓
          </button>

          <button
            className="block-hover-button text-red-400"
            title={t("block.remove")}
            onClick={() => deleteBlock(block.id)}
          >
            ✕
          </button>
        </div>
      )}
      <Editor
        autoFocus={autoFocus}
        block={block}
        update={(newBlock: Block) => updateBlock(block.id, newBlock)}
      />
    </div>
  );
}
