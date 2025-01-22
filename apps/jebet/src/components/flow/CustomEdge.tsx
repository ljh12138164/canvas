import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { Trash } from 'lucide-react';
import styled from 'styled-components';

const IconContainer = styled.div<{
  pathX: number;
  pathY: number;
}>`
  position: absolute;
  top: ${({ pathY }) => pathY}px;
  left: ${({ pathX }) => pathX}px;
  transform: translate(-50%, -50%);
  /* 允许点击 */
  pointer-events: all;
`;
/**
 * #### 自定义节点
 * @param param0
 * @returns
 */
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  // 获取路径和路径点
  const [edgePath, pathX, pathY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <g
        onClick={() => {
          // window.console.log('节点被点击');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // window.console.log('节点被点击');
          }
        }}
      >
        <BaseEdge id={id} path={edgePath} />
      </g>
      {/* 自定义的标点 */}
      <EdgeLabelRenderer>
        {/* 删除 */}
        <IconContainer pathX={pathX} pathY={pathY}>
          <Trash
            className="w-6 h-6 cursor-pointer border  p-1  rounded-sm"
            onClick={() => {
              // window.console.log('删除');
            }}
          />
        </IconContainer>
      </EdgeLabelRenderer>
    </>
  );
}
