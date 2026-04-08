import { getBlock } from "../blocks/blockRegistry";
import type { Block } from "../utils/types";

interface Props {
  block: Block;
}

export default function BlockRenderer({ block }: Props) {
  const def = getBlock(block.blockType);

  if (!def) {
    return (
      <div className="block-unknown">Unknown block: {block.blockType}</div>
    );
  }

  const Render = def.Render;

  return <Render block={block} />;
}
