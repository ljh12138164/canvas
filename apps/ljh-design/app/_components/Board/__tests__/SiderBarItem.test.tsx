import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import SiderBarItem from '../SiderBarItem';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Home: () => <svg data-testid="home-icon" />,
}));

describe('SiderBarItem', () => {
  const defaultProps = {
    label: 'Home',
    Icon: Home,
    href: '/home',
  };

  it('渲染基本组件', () => {
    render(<SiderBarItem {...defaultProps} />);

    // 检查链接
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');

    // 检查图标
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();

    // 检查标签文本
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('激活状态下的样式', () => {
    render(<SiderBarItem {...defaultProps} isActive={true} />);

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('text-blue-600');
    expect(link).toHaveClass('border-l-[3px]');
    expect(link).toHaveClass('font-bold');
    expect(link).toHaveClass('border-blue-500');
  });

  it('非激活状态下的样式', () => {
    render(<SiderBarItem {...defaultProps} isActive={false} />);

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).not.toHaveClass('text-blue-600');
    expect(link).not.toHaveClass('border-l-[3px]');
    expect(link).not.toHaveClass('font-bold');
  });

  it('处理点击事件', async () => {
    const handleClick = vi.fn();
    const mockCloseRef = { current: { click: vi.fn() } };

    render(<SiderBarItem {...defaultProps} onClick={handleClick} closeRef={mockCloseRef as any} />);

    await userEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(mockCloseRef.current.click).toHaveBeenCalledTimes(1);
  });

  it('暗色模式下的样式', () => {
    render(<SiderBarItem {...defaultProps} />);

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('dark:bg-[#1a1a1a]');
    expect(link).toHaveClass('dark:hover:bg-[#2a2a2a]');
    expect(link).toHaveClass('dark:text-gray-200');
  });

  it('激活状态下的暗色模式样式', () => {
    render(<SiderBarItem {...defaultProps} isActive={true} />);

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('dark:text-blue-400');
    expect(link).toHaveClass('dark:bg-[#2a2a2a]');
  });
});
