import { useEffect, useRef } from "react";
import * as Threes from "three";
//屏幕
const secent = new Threes.Scene();
const geometry = new Threes.BoxGeometry(1, 1, 1);
const material = new Threes.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new Threes.Mesh(geometry, material);
secent.add(mesh);
const size = {
  width: 800,
  height: 600,
};
const camera = new Threes.PerspectiveCamera(75, size.width / size.height);
secent.add(camera);
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const render = new Threes.WebGLRenderer({ canvas: canvasRef.current });
    //设置渲染器大小
    render.setSize(size.width, size.height);
    //设置渲染器像素比
    render.render(secent, camera);
  });
  return <canvas ref={canvasRef}></canvas>;
};

export default App;
