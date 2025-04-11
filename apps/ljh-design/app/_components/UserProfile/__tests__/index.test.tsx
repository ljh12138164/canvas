import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserProfile } from '..';

// Mock UI components
vi.mock('../../ui/Avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={className}>{children}</div>,
  AvatarImage: ({ src, alt }: any) => <img src={src} alt={alt} />,
  AvatarFallback: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('../../ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe('UserProfile', () => {
  it('渲染用户信息和头像', () => {
    const mockUserInfo = {
      id: 'user1',
      name: '测试用户',
      email: 'test@example.com',
      image: 'test-image.jpg',
      show: Array(3),
      upvotes: Array(5),
      collections: Array(2),
    };

    render(<UserProfile userInfo={mockUserInfo} />);

    // 检查用户基本信息
    expect(screen.getByText('测试用户')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    // 检查头像
    const avatarImage = screen.getByAltText('测试用户');
    expect(avatarImage).toHaveAttribute('src', 'test-image.jpg');

    // 检查统计数据
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('帖子')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('点赞')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('收藏')).toBeInTheDocument();
  });

  it('处理缺少用户名的情况', () => {
    const mockUserInfo = {
      id: 'user2',
      name: '', // 空名称将使用默认显示
      email: 'noname@example.com',
      image: '',
      show: [],
      upvotes: [],
      collections: [],
    };

    render(<UserProfile userInfo={mockUserInfo} />);

    // 检查默认用户名
    expect(screen.getByText('匿名用户')).toBeInTheDocument();
    expect(screen.getByText('noname@example.com')).toBeInTheDocument();

    // 检查头像显示默认内容
    expect(screen.getByText('no')).toBeInTheDocument();
  });

  it('处理缺少统计数据的情况', () => {
    const mockUserInfo = {
      id: 'user3',
      name: '无数据用户',
      email: 'nodata@example.com',
      image: '',
    };

    render(<UserProfile userInfo={mockUserInfo} />);

    // 检查所有统计数据默认为0
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(3);

    expect(screen.getByText('帖子')).toBeInTheDocument();
    expect(screen.getByText('点赞')).toBeInTheDocument();
    expect(screen.getByText('收藏')).toBeInTheDocument();
  });

  it('处理用户名和邮箱缺少显示内容的情况', () => {
    const mockUserInfo = {
      id: 'user4',
      name: '',
      email: '',
      image: '',
    };

    render(<UserProfile userInfo={mockUserInfo} />);

    // 检查默认显示
    expect(screen.getByText('匿名用户')).toBeInTheDocument();
    expect(screen.getByText('用户')).toBeInTheDocument(); // AvatarFallback的默认值
  });
});
