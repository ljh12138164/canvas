"use client";

import { forwardRef } from "react";

const Editor = forwardRef<HTMLDivElement>((_, ref) => {
  return <div ref={ref}>11</div>;
});

Editor.displayName = "Editor";
export default Editor;
