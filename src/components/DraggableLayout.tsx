import { useState, useEffect } from "react";
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
    const overId = over.id as string; // This is the ID of the element being dragged over

    const activeCol = findColumn(activeId);

    // Determine the target column:
    // If the 'over' element is one of our column IDs ('left', 'right'), use that.
    // Otherwise, try to find the column of the element it's over.
    const overCol =
      overId === "left" || overId === "right" ? overId : findColumn(overId);

    // If we can't determine the target column, or if it's the same as the source, exit.
    if (!activeCol || !overCol || activeCol === overCol) {
      // If overId is NOT "left" or "right", and it's not a form ID, then it's a drag over empty space.
      // In this case, we want to determine the column based on the X-coordinate of the event.
      if (overId !== "left" && overId !== "right" && !findColumn(overId)) {
        const droppableRect = document
          .querySelector(
            `.${overCol === "left" ? "resume-column-left" : "resume-column-right"}`,
          )
          ?.getBoundingClientRect();
        if (droppableRect) {
          const midPoint = droppableRect.left + droppableRect.width / 2;
          if (event.clientX < midPoint) {
            // Dragging over the left half of the empty column area
            const targetCol = "left";
            if (targetCol !== activeCol) {
              setColumns((prev) => {
                const activeItems = prev[activeCol as keyof ColumnsState];
                return {
                  ...prev,
                  [activeCol as keyof ColumnsState]: activeItems.filter(
                    (id) => id !== activeId,
                  ),
                  [targetCol]: [
                    ...prev[targetCol as keyof ColumnsState],
                    activeId,
                  ],
                };
              });
            }
          } else {
            // Dragging over the right half of the empty column area
            const targetCol = "right";
            if (targetCol !== activeCol) {
              setColumns((prev) => {
                const activeItems = prev[activeCol as keyof ColumnsState];
                return {
                  ...prev,
                  [activeCol as keyof ColumnsState]: activeItems.filter(
                    (id) => id !== activeId,
                  ),
                  [targetCol]: [
                    ...prev[targetCol as keyof ColumnsState],
                    activeId,
                  ],
                };
              });
            }
          }
        }
      }
      return;
    }

    // If moving within the same column, rely on arrayMove in onDragEnd
    // This onDragOver is primarily for moving between columns.
    // We need to decide how to handle reordering within a column if it's also
    // a target for a drop from another column. For now, we'll focus on inter-column moves.

    // If we reach here, it's a valid inter-column move.
    // The actual reordering logic will be more robust in onDragEnd.
    // Here, we primarily ensure the item is removed from its original column.
    setColumns((prev) => {
      const activeItems = prev[activeCol as keyof ColumnsState];
      const overItems = prev[overCol as keyof ColumnsState];

      // Remove from source column
      const newActiveItems = activeItems.filter((id) => id !== activeId);

      // Add to target column (at the end for now, precise positioning handled by onDragEnd)
      // If overId is a column ID, append. If it's an item ID, insert before it.
      const newOverItems = [...overItems];
      if (overId === "left" || overId === "right") {
        newOverItems.push(activeId);
      } else {
        const overIndex = overItems.indexOf(overId);
        if (overIndex !== -1) {
          newOverItems.splice(overIndex, 0, activeId);
        } else {
          // If overId is not found in the target column (shouldn't happen if findColumn works)
          // append it.
          newOverItems.push(activeId);
        }
      }

      return {
        ...prev,
        [activeCol as keyof ColumnsState]: newActiveItems,
        [overCol as keyof ColumnsState]: newOverItems,
      };
    });
  };

  // Add to DroppableColumn:

  // In DroppableColumn component, add classes to the main div:
  // ref={setNodeRef} className={`resume-column ${id}`}
  // Add CSS for .resume-column-left and .resume-column-right

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
