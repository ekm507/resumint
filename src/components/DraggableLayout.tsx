import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import MiniBox from "./MiniBox";
import type { FormStructure, LayoutItem } from "../utils/types";

/* ------------------------- Sortable box for each form ------------------------ */
function SortableMiniBox({ id, form }: { id: string; form: FormStructure }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MiniBox form={form} />
    </div>
  );
}

/* ------------------------- Droppable column container ------------------------ */
function DroppableColumn({
  id,
  itemIds,
  forms,
}: {
  id: "left" | "right";
  itemIds: string[];
  forms: FormStructure[];
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`resume-column column-${id}`}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {itemIds.map((formId) => {
          const form = forms.find((f) => f.id === formId);
          if (!form) return null;
          return <SortableMiniBox key={formId} id={formId} form={form} />;
        })}
      </SortableContext>
    </div>
  );
}

/* ------------------------------ Main component ------------------------------- */
export interface DraggableLayoutProps {
  layout: LayoutItem[];
  setLayout: React.Dispatch<React.SetStateAction<LayoutItem[]>>;
  forms: FormStructure[];
}

export default function DraggableLayout({
  layout,
  setLayout,
  forms,
}: DraggableLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  /** derive column lists directly from layout (no redundant state) */
  const columns = {
    left: layout.filter((l) => l.column === "left").map((l) => l.id),
    right: layout.filter((l) => l.column === "right").map((l) => l.id),
  };

  /** sensors for pointer + keyboard interaction */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findColumn = (id: string): "left" | "right" | null => {
    if (columns.left.includes(id)) return "left";
    if (columns.right.includes(id)) return "right";
    return null;
  };

  /* ------------------------------ DnD handlers ------------------------------ */
  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeCol = findColumn(activeId);
    const overCol =
      overId === "left" || overId === "right"
        ? (overId as "left" | "right")
        : findColumn(overId);
    if (!activeCol || !overCol || activeCol === overCol) return; // ignore same-column drag over

    // move item to other column (append to end for now)
    setLayout((prev) => {
      const leftIds = prev.filter((i) => i.column === "left").map((i) => i.id);
      const rightIds = prev
        .filter((i) => i.column === "right")
        .map((i) => i.id);

      const newCols = { left: leftIds, right: rightIds };
      newCols[activeCol] = newCols[activeCol].filter((id) => id !== activeId);
      newCols[overCol] = [...newCols[overCol], activeId];

      return [
        ...newCols.left.map((id) => ({ id, column: "left" as const })),
        ...newCols.right.map((id) => ({ id, column: "right" as const })),
      ];
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeCol = findColumn(activeId);
    const overCol =
      overId === "left" || overId === "right"
        ? (overId as "left" | "right")
        : findColumn(overId);
    if (!activeCol || !overCol) return;

    // If dropped in same column, reorder items
    if (activeCol === overCol) {
      setLayout((prev) => {
        const colItems = prev
          .filter((x) => x.column === activeCol)
          .map((x) => x.id);
        const activeIndex = colItems.indexOf(activeId);
        const overIndex = colItems.indexOf(overId);
        if (activeIndex === overIndex || overIndex === -1) return prev;

        const newIds = arrayMove(colItems, activeIndex, overIndex);
        const otherIds = prev.filter((x) => x.column !== activeCol);
        return [
          ...newIds.map((id) => ({ id, column: activeCol })),
          ...otherIds,
        ];
      });
    }
  };

  const activeForm = activeId ? forms.find((f) => f.id === activeId) : null;

  /* ------------------------------ Render ------------------------------ */
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="resume-columns">
        <DroppableColumn id="left" itemIds={columns.left} forms={forms} />
        <DroppableColumn id="right" itemIds={columns.right} forms={forms} />
      </div>

      <DragOverlay>
        {activeForm ? (
          <div style={{ opacity: 0.8, cursor: "grabbing" }}>
            <MiniBox form={activeForm} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
