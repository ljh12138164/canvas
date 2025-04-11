import { render, screen } from '@testing-library/react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostList } from '../PostList';

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(),
  zhCN: {},
}));

// Mock Render component
vi.mock('../Formue/Render', () => ({
  Render: ({ content }: { content: string }) => <div>{content}</div>,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock UI components
vi.mock('../ui/Avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarImage: ({ src, alt }: any) => <img src={src} alt={alt} />,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../ui/badge', () => ({
  Badge: ({ children, variant }: any) => <div className={variant}>{children}</div>,
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, asChild, size, variant }: any) => {
    const Component = asChild ? 'a' : 'button';
    return <Component className={`${size} ${variant}`}>{children}</Component>;
  },
}));

vi.mock('../ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardFooter: ({ children }: any) => <div>{children}</div>,
}));

describe('PostList', () => {
  const mockItems = [
    {
      id: '1',
      title: '测试帖子1',
      explanation: '这是测试帖子的内容',
      created_at: '2024-03-20T10:00:00Z',
      tags: '技术',
      userId: 'user1',
      profiles: {
        name: '测试用户',
        image: 'test-image.jpg',
      },
    },
    {
      id: '2',
      title: '测试帖子2',
      created_at: '2024-03-19T10:00:00Z',
      userId: 'user2',
    },
  ];

  beforeEach(() => {
    (formatDistanceToNow as any).mockImplementation(() => '1天前');
  });

  it('渲染空帖子列表', () => {
    render(<PostList items={[]} type="posts" />);
    expect(screen.getByText('该用户还没有发布任何帖子')).toBeInTheDocument();
  });
  it('渲染点赞列表', () => {
    render(<PostList items={[]} type="likes" />);
    expect(screen.getByText('该用户还没有点赞任何帖子')).toBeInTheDocument();
  });
  it('渲染收藏列表', () => {
    render(<PostList items={[]} type="collections" />);
    expect(screen.getByText('该用户还没有收藏任何帖子')).toBeInTheDocument();
  });

  it('渲染帖子列表', () => {
    render(<PostList items={mockItems} type="posts" />);

    // 检查帖子标题
    expect(screen.getByText('测试帖子1')).toBeInTheDocument();
    expect(screen.getByText('测试帖子2')).toBeInTheDocument();

    // 检查标签
    expect(screen.getByText('技术')).toBeInTheDocument();

    // 检查时间
    expect(screen.getAllByText('1天前')).toHaveLength(2);

    // 检查用户信息
    expect(screen.getByText('测试用户')).toBeInTheDocument();
    expect(screen.getByText('匿名用户')).toBeInTheDocument();

    // 检查详情按钮
    const detailButtons = screen.getAllByText('查看详情');
    expect(detailButtons).toHaveLength(2);
    expect(detailButtons[0]).toHaveAttribute('href', '/board/formue/1');
  });

  it('渲染点赞列表', () => {
    render(<PostList items={mockItems} type="likes" />);
    expect(screen.getByText('测试帖子1')).toBeInTheDocument();
  });

  it('渲染收藏列表', () => {
    render(<PostList items={mockItems} type="collections" />);
    expect(screen.getByText('测试帖子1')).toBeInTheDocument();
  });

  it('处理没有详细描述的情况', () => {
    render(<PostList items={[mockItems[1]]} type="posts" />);
    expect(screen.getByText('暂无详细描述')).toBeInTheDocument();
  });

  it('处理没有用户信息的情况', () => {
    render(<PostList items={[mockItems[1]]} type="posts" />);
    expect(screen.getByText('匿名用户')).toBeInTheDocument();
  });
});
