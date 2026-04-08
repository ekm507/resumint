// src/hooks/useFormEditor.ts
import { useCallback, useMemo } from "react";
import type { FormStructure, Block, BlockType } from "../utils/types";
import { createBlock, nextId, resetPropsForType } from "../utils/blocks";

export function useFormEditor(
  form: FormStructure,
  onFormChange: (id: string, newForm: FormStructure) => void,
) {
  const { id, blocks } = form;

  const setForm = useCallback(
    (patch: Partial<FormStructure>) => {
      onFormChange(id, { ...form, ...patch });
    },
    [id, form, onFormChange],
  );

  const setTitle = useCallback(
    (title: string) => setForm({ title }),
    [setForm],
  );

  const updateBlocks = useCallback(
    (newBlocks: Block[]) => setForm({ blocks: newBlocks }),
    [setForm],
  );

  const updateBlock = useCallback(
    (blockId: string, props: any) => {
      updateBlocks(
        blocks.map((b) =>
          b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b,
        ),
      );
    },
    [blocks, updateBlocks],
  );

  const setBlockType = useCallback(
    (blockId: string, type: BlockType) => {
      updateBlocks(
        blocks.map((b) =>
          b.id === blockId
            ? {
                ...b,
                blockType: type,
                props: resetPropsForType(type),
                // اگر نوعی دارید که children لازم دارد، اینجا مدیریت کنید
                children: type === "list" ? (b.children ?? []) : undefined,
              }
            : b,
        ),
      );
    },
    [blocks, updateBlocks],
  );

  const deleteBlock = useCallback(
    (blockId: string) => updateBlocks(blocks.filter((b) => b.id !== blockId)),
    [blocks, updateBlocks],
  );

  const addBlock = useCallback(() => {
    const idStr = nextId(blocks);
    const nb = { ...createBlock("text"), id: idStr };
    updateBlocks([...blocks, nb]);
  }, [blocks, updateBlocks]);

  return useMemo(
    () => ({
      form,
      title: form.title,
      blocks,
      setTitle,
      updateBlock,
      deleteBlock,
      setBlockType,
      addBlock,
      setForm,
      updateBlocks,
    }),
    [
      form,
      blocks,
      setTitle,
      updateBlock,
      deleteBlock,
      setBlockType,
      addBlock,
      setForm,
      updateBlocks,
    ],
  );
}
