import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button';

describe('Button', () => {
  it('渲染默认按钮', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('渲染不同变体的按钮', () => {
    render(
      <>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </>,
    );

    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');
    expect(screen.getByText('Outline')).toHaveClass('border');
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');
    expect(screen.getByText('Ghost')).toHaveClass('hover:bg-accent');
    expect(screen.getByText('Link')).toHaveClass('text-primary');
  });

  it('渲染不同尺寸的按钮', () => {
    render(
      <>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">Icon</Button>
      </>,
    );

    expect(screen.getByText('Small')).toHaveClass('h-8');
    expect(screen.getByText('Default')).toHaveClass('h-9');
    expect(screen.getByText('Large')).toHaveClass('h-10');
    expect(screen.getByText('Icon')).toHaveClass('h-9 w-9');
  });

  it('处理点击事件', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('禁用状态', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('作为子组件渲染', () => {
    render(
      <Button asChild>
        <a href="/">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('bg-primary');
  });
});
