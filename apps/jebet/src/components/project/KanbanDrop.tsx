import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useState } from "react";

import { TaskWithWorkspace } from "@/types/workspace";
import { nanoid } from "nanoid";
import { KanbanDroggable } from "./KanbanDraggable";
import { KanbanDroppable } from "./KanbanDroppable";

const KanbanDrop = ({ taskList }: { taskList: TaskWithWorkspace[] }) => {
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const id = nanoid();
  const draggableMarkup = <KanbanDroggable id={id}>Drag me</KanbanDroggable>;
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <KanbanDroppable key={id} id={id}>
          {parent === id ? draggableMarkup : "Drop here"}
        </KanbanDroppable>
      ))}
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
};

export default KanbanDrop;
