import { useDroppable } from "@dnd-kit/core";

export function KanbanDroppable({
  children,
  id,
  color,
}: {
  children: React.ReactNode;
  id: string;
  color: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    color: isOver ? color : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
