import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useState } from "react";

import { TaskWithWorkspace } from "@/types/workspace";
import { KanbanDroggable } from "./KanbanDraggable";
import { KanbanDroppable } from "./KanbanDroppable";
import styled from "styled-components";
import { ScrollArea } from "../ui/scrollArea";
import KanbanItem from "./KanbanItem";

const DropContainer = styled(ScrollArea)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f0f0f0a7;
  height: 300px;
`;
const DropItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const KanbanDrop = ({
  taskList,
  color,
}: {
  taskList: TaskWithWorkspace[] | false;
  color: string;
}) => {
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  if (!taskList) return null;

  //可拖拽的元素

  return (
    <DropContainer>
      <DndContext onDragEnd={handleDragEnd}>
        {parent === null ? (
          <>
            {taskList.map((task) => (
              <DropItem>
                <KanbanDroggable id={task.id}>
                  {/* 拖拽的元素 */}
                  <KanbanItem task={task} />
                </KanbanDroggable>
              </DropItem>
            ))}
          </>
        ) : null}
        {containers.map((id) => (
          // We updated the Droppable component so it would accept an `id`
          // prop and pass it to `useDroppable`
          <KanbanDroppable color={color} key={id} id={id}>
            {parent === id ? (
              <>
                {taskList.map((task) => (
                  <DropItem>
                    <KanbanDroggable id={task.id}>
                      {/* 拖拽的元素 */}
                      <div>{task.name}</div>
                    </KanbanDroggable>
                  </DropItem>
                ))}
              </>
            ) : (
              "放这里"
            )}
          </KanbanDroppable>
        ))}
      </DndContext>
    </DropContainer>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
};

export default KanbanDrop;
