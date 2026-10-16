import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";
import { useI18n } from "../i18nContext";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


function SortableTag({
  id,
  tag,
  tagClass,
  updateTag,
  removeTag,
}: {
  id: string;
  tag: string;
  tagClass: string;
  updateTag: (value: string) => void;
  removeTag: () => void;
}) {
  const { t } = useI18n();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "none",
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <span ref={setNodeRef} style={style} className={tagClass + " flex items-center gap-1"}>
      <span
        className="tag-drag-handle"
        {...attributes}
        {...listeners}
        title={t("common.dragToReorder")}
        style={{ cursor: "grab" }}
      >
        ☰
      </span>
      <input
        className="bg-transparent border-0 outline-none text-inherit min-w-[3ch]"
        style={{ width: `${Math.max(3, tag.length + 1)}ch` }}
        value={tag}
        onChange={(e) => updateTag(e.target.value)}
      />
      <button className="item-remove-text" onClick={removeTag}>
        ×
      </button>
    </span>
  );
}

export function TagsEditor({ block, update }: any) {
  const { t } = useI18n();
  const {
    tags = [],
    shape = "pill",
    size = "md",
    variant = "filled",
  } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const updateItem = (i: number, val: string) => {
    const copy = [...tags];
    copy[i] = val;
    setProp("tags", copy);
  };

  const tagClass = `tags-block-tag tag-shape-${shape} tag-size-${size} tag-variant-${variant}`;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const reorderTags = (from: number, to: number) => {
    if (from === to) return;
    setProp("tags", arrayMove([...tags], from, to));
  };

  return (
    <div className="tags-block-editor">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;
          reorderTags(Number(active.id), Number(over.id));
        }}
      >
        <SortableContext
          items={tags.map((_: string, i: number) => String(i))}
          strategy={rectSortingStrategy}
        >
          <div className="tags-block">
            {tags.map((tag: string, i: number) => (
              <SortableTag
                key={i}
                id={String(i)}
                tag={tag}
                tagClass={tagClass}
                updateTag={(value: string) => updateItem(i, value)}
                removeTag={() =>
                  setProp(
                    "tags",
                    tags.filter((_: any, idx: number) => idx !== i),
                  )
                }
              />
            ))}
            <button
              className={tagClass + " cursor-pointer"}
              onClick={() => setProp("tags", [...tags, ""])}
            >
              {t("tags.add")}
            </button>
          </div>
        </SortableContext>
      </DndContext>

      <AdvancedOptions block={block} update={update}>
        <div className="options-grid">
          <div className="option-group">
            <label>{t("tags.shape")}</label>
            <ToggleButton
              value={shape}
              onChange={(v) => setProp("shape", v)}
              options={[
                { value: "pill", label: t("tags.pill") },
                { value: "rounded", label: t("tags.rounded") },
                { value: "square", label: t("tags.square") },
              ]}
            />
          </div>
          <div className="option-group">
            <label>{t("tags.size")}</label>
            <ToggleButton
              value={size}
              onChange={(v) => setProp("size", v)}
              options={[
                { value: "sm", label: t("tags.small") },
                { value: "md", label: t("tags.medium") },
                { value: "lg", label: t("tags.large") },
              ]}
            />
          </div>

          <div className="option-group">
            <label>{t("tags.style")}</label>

            <ToggleButton
              value={variant}
              onChange={(v) => setProp("variant", v)}
              options={[
                { value: "filled", label: t("tags.filled") },
                { value: "outline", label: t("tags.outline") },
              ]}
            />
          </div>
        </div>
      </AdvancedOptions>
    </div>
  );
}

export function TagsRender({ block, editable = true }: any) {
  const { t } = useI18n();
  const {
    tags = [],
    shape = "pill",
    size = "md",
    variant = "filled",
  } = block.props || {};

  const hasTag = Array.isArray(tags) && tags.some((tag: string) => String(tag ?? "").trim() !== "");

  return (
    <div className={`tags-block align-start`} dir="auto">
      {hasTag ? (
        tags.map((tag: string, i: number) => (
          <span
            key={i}
            className={`tags-block-tag tag-shape-${shape} tag-size-${size} tag-variant-${variant}`}
          >
            {tag}
          </span>
        ))
      ) : editable ? (
        <span
          className={`tags-block-tag tag-shape-${shape} tag-size-${size} tag-variant-${variant} tags-placeholder`}
        >
          {t("tags.placeholder")}
        </span>
      ) : null}
    </div>
  );
}

registerBlock({
  type: "tags",
  label: "block.tags",

  create(): Block {
    return {
      id: "",
      blockType: "tags",
      props: {
        tags: [""],
        shape: "pill",
        size: "md",
        variant: "filled",
      },
    };
  },

  Editor: TagsEditor,
  Render: TagsRender,
});
