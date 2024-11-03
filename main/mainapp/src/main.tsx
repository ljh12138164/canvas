import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import microApp from "@micro-zoe/micro-app";
import { RouterProvider } from "react-router-dom";
import router from "./router";

microApp.start();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
