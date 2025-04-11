import type { UserResponseType } from '@/app/_hook/query/useUser';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserLike } from '../UserLike';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

// Mock dayjs
vi.mock('dayjs', () => ({
  default: (date: string) => ({
    format: (format: string) => {
      if (format === 'YYYY年MM月DD日') return '2023年01月01日';
      return date;
    },
  }),
}));

// Mock Loading 组件
vi.mock('../Loading', () => ({
  Loading: () => <div data-testid="loading-component">Loading</div>,
}));

// Mock AvatarImage 组件
vi.mock('@/app/_components/Comand/AvatarImage', () => ({
  default: ({ userInfo, src, alt, width, height }: any) => (
    <img
      data-testid="avatar-image"
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-user-id={userInfo?.id}
    />
  ),
}));

describe('UserLike', () => {
  it('加载状态下渲染 Loading 组件', () => {
    render(<UserLike data={undefined} loading={true} />);

    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('无数据时渲染暂无数据提示', () => {
    render(<UserLike data={[{ show: undefined }] as any} loading={false} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('渲染点赞列表', () => {
    const mockData: UserResponseType = [
      {
        show: {
          id: 'show-1',
          title: '测试标题1',
          profiles: {
            id: 'user-1',
            name: '测试用户1',
            image: 'test1.jpg',
            email: 'test1@example.com',
          },
        },
        created_at: '2023-01-01',
      },
      {
        show: {
          id: 'show-2',
          title: '测试标题2',
          profiles: {
            id: 'user-2',
            name: '测试用户2',
            image: 'test2.jpg',
            email: 'test2@example.com',
          },
        },
        created_at: '2023-01-02',
      },
    ] as any;

    render(<UserLike data={mockData} loading={false} />);

    // 检查是否渲染了正确数量的项目
    const links = screen.getAllByTestId('next-link');
    expect(links.length).toBe(2);

    // 检查链接地址
    expect(links[0]).toHaveAttribute('href', '/board/formue/show-1');
    expect(links[1]).toHaveAttribute('href', '/board/formue/show-2');

    // 检查标题内容
    expect(screen.getByText('标题：测试标题1')).toBeInTheDocument();
    expect(screen.getByText('标题：测试标题2')).toBeInTheDocument();

    // 检查时间格式
    const times = screen.getAllByText('点赞时间：2023年01月01日');
    expect(times.length).toBe(2);

    // 检查头像
    const avatars = screen.getAllByTestId('avatar-image');
    expect(avatars.length).toBe(2);
    expect(avatars[0]).toHaveAttribute('src', 'test1.jpg');
    expect(avatars[0]).toHaveAttribute('alt', '测试用户1');
    expect(avatars[1]).toHaveAttribute('src', 'test2.jpg');
    expect(avatars[1]).toHaveAttribute('alt', '测试用户2');
  });

  it('处理空数据列表', () => {
    render(<UserLike data={[]} loading={false} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('处理缺少图像的情况', () => {
    const mockData: UserResponseType = [
      {
        show: {
          id: 'show-1',
          title: '测试标题1',
          profiles: {
            id: 'user-1',
            name: '测试用户1',
            image: '', // 空图像路径
            email: 'test1@example.com',
          },
        },
        created_at: '2023-01-01',
      },
    ] as any;

    render(<UserLike data={mockData} loading={false} />);

    // 检查头像
    const avatar = screen.getByTestId('avatar-image');
    // 不检查src属性，只检查alt属性
    expect(avatar).toHaveAttribute('alt', '测试用户1');
  });

  it('处理缺少用户名的情况', () => {
    const mockData: UserResponseType = [
      {
        show: {
          id: 'show-1',
          title: '测试标题1',
          profiles: {
            id: 'user-1',
            name: '', // 空用户名
            image: 'test1.jpg',
            email: 'test1@example.com',
          },
        },
        created_at: '2023-01-01',
      },
    ] as any;

    render(<UserLike data={mockData} loading={false} />);

    // 检查头像
    const avatar = screen.getByTestId('avatar-image');
    expect(avatar).toHaveAttribute('src', 'test1.jpg');
    expect(avatar).toHaveAttribute('alt', '用户'); // 应该使用默认值"用户"
  });

  it('处理很长的标题', () => {
    const longTitle = '这是一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的标题';
    const mockData: UserResponseType = [
      {
        show: {
          id: 'show-1',
          title: longTitle,
          profiles: {
            id: 'user-1',
            name: '测试用户1',
            image: 'test1.jpg',
            email: 'test1@example.com',
          },
        },
        created_at: '2023-01-01',
      },
    ] as any;

    render(<UserLike data={mockData} loading={false} />);

    // 检查标题已渲染
    const titleElement = screen.getByText(`标题：${longTitle}`);
    expect(titleElement).toBeInTheDocument();
    // line-clamp-2 类应该应用于标题
    expect(titleElement).toHaveClass('line-clamp-2');
  });
});
