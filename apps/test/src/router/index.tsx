import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';

const Live = lazy(() => import('../page/live'));
const Form = lazy(() => import('../page/autoform'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'live',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            {/* 使用组件形式包裹lazy组件 */}
            <Live />
          </Suspense>
        ),
      },
      {
        path: 'form',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            {/* 使用组件形式包裹lazy组件 */}
            <Form />
          </Suspense>
        ),
      },
    ],
  },
]);
