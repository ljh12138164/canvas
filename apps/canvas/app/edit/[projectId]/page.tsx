"use client";

import { ReactElement, RefObject, useEffect, useRef } from "react";
import { useCanvas } from "@/hook/useCanvas";
import * as fabric from "fabric"; // v6
import Editor from "@/app/_components/edit/Editor";
interface EditProjectIdPageProps {
  params: {
    projectId: string;
  };
}
const EditProjectIdPage = ({ params }: EditProjectIdPageProps) => {
  const { init } = useCanvas();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const divref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editorRef.current) {
      console.log(editorRef.current);
    }
    if (canvasRef.current) {
      const canvas = canvasRef.current.getContext("2d");
      canvas?.beginPath();
      canvas?.moveTo(0, 0);
      canvas?.lineTo(100, 0);
      canvas?.lineTo(100, 100);
      canvas?.lineTo(0, 100);
      canvas?.stroke();
      // init({
      //   initCanvas: canvas,
      //   initContainer: divref.current!,
      // });
    }
  }, [init]);
  // useEffect(() => {
  //   const options = {};
  //   const canvas = new fabric.Canvas(canvasRef.current!, options);
  //   // make the fabric.Canvas instance available to your app
  //   console.log(canvas);
  // }, []);
  return (
    <div ref={divref}>
      <Editor ref={editorRef}></Editor>
      {params.projectId}
      <canvas width={300} height={300} ref={canvasRef}></canvas>
    </div>
  );
};

export default EditProjectIdPage;
