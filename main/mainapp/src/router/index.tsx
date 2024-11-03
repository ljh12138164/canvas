import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
const Jebe = lazy(() => import("./jebe"));
const Design = lazy(() => import("./design"));
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Jebe></Jebe> */}
        <Design></Design>
      </Suspense>
    ),
  },
  {
    path: "/jebe",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Jebe />
      </Suspense>
    ),
  },
  {
    path: "/design",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Design />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <div>404 未找到页面</div>,
  },
]);

export default router;
