import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Loading } from '../Loading';

// Mock Skeleton 组件
vi.mock('@/app/_components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'test-id',
}));

describe('Loading', () => {
  it('渲染加载骨架屏', () => {
    render(<Loading />);

    // 检查容器
    const container = screen.getByText((_content, element) => {
      return element?.tagName.toLowerCase() === 'div' && element?.className.includes('space-y-5');
    });
    expect(container).toBeInTheDocument();

    // 检查网格布局
    const grid = screen.getByText((_content, element) => {
      return element?.tagName.toLowerCase() === 'div' && element?.className.includes('grid-cols-2');
    });
    expect(grid).toBeInTheDocument();

    // 检查是否渲染了8个骨架项
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(8);

    // 检查每个骨架项的样式
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass('rounded-lg');
      expect(skeleton).toHaveClass('h-[100px]');
    });
  });
});
