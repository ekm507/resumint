import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useRef, useState } from "react";
import MiniBox from "./MiniBox";
import type { FormStructure, LayoutItem } from "../utils/types";

/* ------------------------- Sortable box ------------------------ */
function SortableMiniBox({
  id,
  form,
  onFormChange,
  onDelete,
  editable,
  onOpenSection,
  previewScale = 1,
  dragDisabled = false,
}: {
  id: string;
  form: FormStructure;
  onFormChange?: (id: string, form: FormStructure) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
  onOpenSection?: (id: string) => void;
  previewScale?: number;
  dragDisabled?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isEditing || dragDisabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform ? { ...transform, x: transform.x / previewScale, y: transform.y / previewScale } : null),
    transition,
    opacity: isDragging && !onOpenSection ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 10 : undefined,
    cursor: "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={onOpenSection ? 'mobile-preview-section' : undefined}
      data-section-id={id}
      aria-label={onOpenSection ? form.title || undefined : undefined}
      onClickCapture={onOpenSection ? event => {
        event.preventDefault();
        event.stopPropagation();
        if (!isDragging) onOpenSection(id);
      } : undefined}
      onKeyDown={onOpenSection ? event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpenSection(id); }
      } : event => listeners?.onKeyDown?.(event)}
    >
      <MiniBox
        form={form}
        onFormChange={onFormChange}
        onDelete={onDelete}
        editable={editable}
        onEditingChange={setIsEditing}
      />
    </div>
  );
}

/* ------------------------- Droppable column ------------------------ */
function DroppableColumn({
  id,
  itemIds,
  forms,
  onFormChange,
  onDelete,
  editable,
  onOpenSection,
  previewScale = 1,
  dragDisabled = false,
}: {
  id: "left" | "right";
  itemIds: string[];
  forms: FormStructure[];
  onFormChange?: (id: string, form: FormStructure) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
  onOpenSection?: (id: string) => void;
  previewScale?: number;
  dragDisabled?: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`resume-column column-${id}`}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {itemIds.map((formId) => {
          const form = forms.find((f) => f.id === formId);
          if (!form) return null;
          return (
            <SortableMiniBox
              key={formId}
              id={formId}
              form={form}
              onFormChange={onFormChange}
              onDelete={onDelete}
              editable={editable}
              onOpenSection={onOpenSection}
              previewScale={previewScale}
              dragDisabled={dragDisabled}
            />
          );
        })}
      </SortableContext>
    </div>
  );
}

/* ------------------------------ Main ------------------------------- */
export interface DraggableLayoutProps {
  layout: LayoutItem[];
  setLayout: React.Dispatch<React.SetStateAction<LayoutItem[]>>;
  forms: FormStructure[];
  setForm?: (id: string, form: FormStructure) => void;
  deleteForm?: (id: string) => void;
  editable?: boolean;
  onOpenSection?: (id: string) => void;
  previewScale?: number;
  dragDisabled?: boolean;
}

function findContainer(id: string, layout: LayoutItem[]): "left" | "right" | null {
  if (id === "left" || id === "right") return id as "left" | "right";
  const item = layout.find((entry) => entry.id === id);
  return item?.column ?? null;
}

const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return closestCorners(args);
};

export default function DraggableLayout({
  layout,
  setLayout,
  forms,
  setForm,
  deleteForm,
  editable,
  onOpenSection,
  previewScale = 1,
  dragDisabled = false,
}: DraggableLayoutProps) {
  const dragStartLayout = useRef(layout);
  const [activeId, setActiveId] = useState<string | null>(null);

  const columns = useMemo(
    () => ({
      left: layout.filter((l) => l.column === "left").map((l) => l.id),
      right: layout.filter((l) => l.column === "right").map((l) => l.id),
    }),
    [layout],
  );

  const desktopSensor = useSensor(PointerSensor, { activationConstraint: { distance: 8 } });
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 8 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } });
  const sensors = useSensors(...(onOpenSection ? [mouseSensor, touchSensor] : [desktopSensor]));

  const onDragStart = (event: DragStartEvent) => {
    dragStartLayout.current = layout;
    setActiveId(event.active.id as string);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdValue = active.id as string;
    const overIdValue = over.id as string;

    const activeContainer = findContainer(activeIdValue, layout);
    const overContainer = findContainer(overIdValue, layout);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setLayout((prev) => {
      const prevLeft = prev
        .filter((entry) => entry.column === "left")
        .map((entry) => entry.id);
      const prevRight = prev
        .filter((entry) => entry.column === "right")
        .map((entry) => entry.id);

      const sourceItems =
        activeContainer === "left" ? prevLeft : prevRight;
      const targetItems =
        overContainer === "left" ? prevLeft : prevRight;

      const sourceIndex = sourceItems.indexOf(activeIdValue);
      if (sourceIndex !== -1) sourceItems.splice(sourceIndex, 1);

      let insertIndex = targetItems.length;
      if (overIdValue !== "left" && overIdValue !== "right") {
        const overIndex = targetItems.indexOf(overIdValue);
        if (overIndex !== -1) insertIndex = overIndex;
      }

      targetItems.splice(insertIndex, 0, activeIdValue);

      const nextLeft =
        overContainer === "left" ? targetItems : sourceItems;
      const nextRight =
        overContainer === "left" ? sourceItems : targetItems;

      return [
        ...nextLeft.map((id) => ({ id, column: "left" as const })),
        ...nextRight.map((id) => ({ id, column: "right" as const })),
      ];
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeIdValue = active.id as string;
    const overIdValue = over.id as string;

    const activeContainer = findContainer(activeIdValue, layout);
    const overContainer = findContainer(overIdValue, layout);

    if (!activeContainer || !overContainer) return;

    if (activeContainer !== overContainer) return;

    if (activeIdValue === overIdValue) return;

    const columnItems =
      activeContainer === "left" ? columns.left : columns.right;
    const activeIndex = columnItems.indexOf(activeIdValue);
    const overIndex = columnItems.indexOf(overIdValue);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return;
    }

    setLayout((prev) => {
      const leftIds = prev
        .filter((entry) => entry.column === "left")
        .map((entry) => entry.id);
      const rightIds = prev
        .filter((entry) => entry.column === "right")
        .map((entry) => entry.id);

      const currentIds = activeContainer === "left" ? leftIds : rightIds;
      const otherIds = activeContainer === "left" ? rightIds : leftIds;
      const reordered = arrayMove(currentIds, activeIndex, overIndex);

      return activeContainer === "left"
        ? [
            ...reordered.map((id) => ({ id, column: "left" as const })),
            ...otherIds.map((id) => ({ id, column: "right" as const })),
          ]
        : [
            ...otherIds.map((id) => ({ id, column: "left" as const })),
            ...reordered.map((id) => ({ id, column: "right" as const })),
          ];
    });
  };

  const activeForm = activeId
    ? forms.find((form) => form.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => { setLayout(dragStartLayout.current); setActiveId(null); }}
    >
      <div className="resume-columns">
        <DroppableColumn
          id="left"
          itemIds={columns.left}
          forms={forms}
          onFormChange={setForm}
          onDelete={deleteForm}
          editable={editable}
          onOpenSection={onOpenSection}
          previewScale={previewScale}
          dragDisabled={dragDisabled}
        />
        <DroppableColumn
          id="right"
          itemIds={columns.right}
          forms={forms}
          onFormChange={setForm}
          onDelete={deleteForm}
          editable={editable}
          onOpenSection={onOpenSection}
          previewScale={previewScale}
          dragDisabled={dragDisabled}
        />
      </div>

      {!onOpenSection && <DragOverlay>
        {activeForm ? (
          <div style={{ opacity: 0.8, cursor: "grabbing" }}>
            <MiniBox form={activeForm} editable={false} />
          </div>
        ) : null}
      </DragOverlay>}
    </DndContext>
  );
}
