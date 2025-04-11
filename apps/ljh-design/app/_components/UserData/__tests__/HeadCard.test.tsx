import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeadCard from '../HeadCard';

// Mock UI 组件
vi.mock('@/app/_components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

describe('HeadCard', () => {
  it('渲染数据卡片', () => {
    const mockData = [
      { title: '测试标题1', total: 10 },
      { title: '测试标题2', total: 20 },
      { title: '测试标题3', total: 30 },
    ];

    render(<HeadCard data={mockData} />);

    // 检查卡片容器
    const gridContainer = screen.getByText((_content, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' &&
        element?.className.includes('grid') &&
        element?.className.includes('gap-4')
      );
    });
    expect(gridContainer).toBeInTheDocument();

    // 检查卡片数量
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(mockData.length);

    // 检查卡片标题
    const titles = screen.getAllByTestId('card-title');
    expect(titles.length).toBe(mockData.length);
    expect(titles[0]).toHaveTextContent('测试标题1');
    expect(titles[1]).toHaveTextContent('测试标题2');
    expect(titles[2]).toHaveTextContent('测试标题3');

    // 检查卡片内容
    const contents = screen.getAllByTestId('card-content');
    expect(contents.length).toBe(mockData.length);
    expect(contents[0]).toHaveTextContent('10');
    expect(contents[1]).toHaveTextContent('20');
    expect(contents[2]).toHaveTextContent('30');
  });

  it('渲染空数据数组', () => {
    render(<HeadCard data={[]} />);

    // 没有卡片
    const cards = screen.queryAllByTestId('card');
    expect(cards.length).toBe(0);
  });
});
