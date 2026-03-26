import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MiniBox from "./MiniBox";
import type { FormStructure, LayoutItem } from "../utils/types";

// --- Sortable Wrapper ---
function SortableMiniBox({ id, form }: { id: string; form: FormStructure }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MiniBox form={form} />
    </div>
  );
}

// --- Column Wrapper ---
function DroppableColumn({
  id,
  itemIds,
  forms,
}: {
  id: string;
  itemIds: string[];
  forms: FormStructure[];
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="resume-column" ref={setNodeRef}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {itemIds.map((itemId) => {
          const form = forms.find((f) => f.id === itemId);
          if (!form) return null;
          return <SortableMiniBox key={itemId} id={itemId} form={form} />;
        })}
      </SortableContext>
    </div>
  );
}

// --- Main Layout Manager ---
interface DraggableLayoutProps {
  layout: LayoutItem[];
  setLayout: React.Dispatch<React.SetStateAction<LayoutItem[]>>;
  forms: FormStructure[];
}

type ColumnsState = {
  left: string[];
  right: string[];
};

export default function DraggableLayout({
  layout,
  setLayout,
  forms,
}: DraggableLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Convert flat layout array to columns object for DnD Kit
  const [columns, setColumns] = useState<ColumnsState>({
    left: layout.filter((i) => i.column === "left").map((i) => i.id),
    right: layout.filter((i) => i.column === "right").map((i) => i.id),
  });

  // Sync back to parent when columns change
  useEffect(() => {
    const newLayout: LayoutItem[] = [
      ...columns.left.map((id) => ({ id, column: "left" as const })),
      ...columns.right.map((id) => ({ id, column: "right" as const })),
    ];
    setLayout(newLayout);
  }, [columns, setLayout]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findColumn = (id: string) => {
    if (columns.left.includes(id)) return "left";
    if (columns.right.includes(id)) return "right";
    return null;
  };

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
      overId === "left" || overId === "right" ? overId : findColumn(overId);

    if (!activeCol || !overCol || activeCol === overCol) return;

    setColumns((prev) => {
      const activeItems = prev[activeCol as keyof ColumnsState];
      const overItems = prev[overCol as keyof ColumnsState];
      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      let newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;

      return {
        ...prev,
        [activeCol]: prev[activeCol as keyof ColumnsState].filter(
          (id) => id !== activeId,
        ),
        [overCol]: [
          ...prev[overCol as keyof ColumnsState].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overCol as keyof ColumnsState].slice(
            newIndex,
            prev[overCol as keyof ColumnsState].length,
          ),
        ],
      };
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeCol = findColumn(activeId);
    const overCol =
      overId === "left" || overId === "right" ? overId : findColumn(overId);

    if (activeCol && overCol && activeCol === overCol) {
      const activeIndex =
        columns[activeCol as keyof ColumnsState].indexOf(activeId);
      const overIndex = columns[overCol as keyof ColumnsState].indexOf(overId);

      if (activeIndex !== overIndex) {
        setColumns((prev) => ({
          ...prev,
          [overCol]: arrayMove(
            prev[overCol as keyof ColumnsState],
            activeIndex,
            overIndex,
          ),
        }));
      }
    }
    setActiveId(null);
  };

  const activeForm = activeId ? forms.find((f) => f.id === activeId) : null;

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
