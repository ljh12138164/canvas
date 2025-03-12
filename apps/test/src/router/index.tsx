import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Live = lazy(() => import('../page/live'));
const Home = lazy(() => import('../page'));
const Form = lazy(() => import('../page/autoform'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
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
