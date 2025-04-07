import type { InitFabicObject } from '@/app/_types/Edit';
import * as fabric from 'fabric';
import { useCallback, useEffect } from 'react';
interface ResponseProps {
  canvas: fabric.Canvas | null;
  contain: HTMLDivElement | null;
}
/**
 * ### 初始化
 * @param param 0 canvas 画布ref
 * @param contain 容器ref
 */
const useResponse = ({ canvas, contain }: ResponseProps) => {
  // 确保画布内容在容器大小变化时能够正确缩放和居中显示。
  const authZoom = useCallback(async () => {
    if (!canvas || !contain) return;
    const width = contain.offsetWidth;
    const height = contain.offsetHeight;
    canvas.setDimensions({
      width,
      height,
    });
    // 获取画布中心
    const center = canvas.getCenterPoint();
    //缩放比例
    const zoomRation = 0.85;
    //画布对象
    const localWorkspace = canvas
      .getObjects()
      .find((item) => (item as InitFabicObject).name === 'board');
    // 缩放

    if (!localWorkspace) return;
    // 缩放比例
    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width: width,
      height: height,
    });

    // 缩放比例
    const zoom = zoomRation * scale;
    // 设置新的矩阵
    canvas.setViewportTransform(fabric.iMatrix.concat() as fabric.TMat2D);

    // 缩放画布
    canvas.zoomToPoint(new fabric.Point(center.x, center.y), zoom);
    // 获取画布中心
    const workspace = localWorkspace.getCenterPoint();
    // 获取画布视图
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) {
      return;
    }
    //设置画布位置
    viewportTransform[4] = canvas.width / 2 - workspace.x * viewportTransform?.[0];
    viewportTransform[5] = canvas.height / 2 - workspace.y * viewportTransform?.[3];
    canvas.setViewportTransform(viewportTransform);
    //重新渲染
    const data = await localWorkspace.clone();
    canvas.clipPath = data;
    canvas.renderAll();
  }, [canvas, contain]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (canvas && contain) {
      // 创建 ResizeObserver
      resizeObserver = new ResizeObserver(async () => {
        await authZoom();
        //设置画布大小
      });
      // 观察容器
      resizeObserver.observe(contain);
    }
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, contain, authZoom]);
  return { authZoom };
};

export default useResponse;
