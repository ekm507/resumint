import { getBlock } from "../blocks/blockRegistry";
import type { Block } from "../utils/types";
import { useI18n } from "../i18nContext";

interface Props {
  block: Block;
  editable?: boolean;
}

export default function BlockRenderer({ block, editable = true }: Props) {
  const { t } = useI18n();

  if (!block) {
    if (!editable) return null;
    return <div className="block-error">{t("block.empty")}</div>;
  }

  const def = getBlock(block.blockType);

  if (!def) {
    if (!editable) return null;
    return (
      <div className="block-unknown">{t("block.unknown")} {block.blockType}</div>
    );
  }

  const Render = def.Render;

  return <Render block={block} editable={editable} />;
}
