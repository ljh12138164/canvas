import { login, signup } from '@/app/_database/user';
import useUsers from '@/app/_hook/useUser';
import { indexDBChange } from '@/app/_lib/utils';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignIn from '../SignIn';

// 模拟依赖
vi.mock('@/app/_database/user', () => ({
  login: vi.fn(),
  signup: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/app/_hook/useUser', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@/app/_lib/utils', () => ({
  indexDBChange: vi.fn(),
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

// 修复toast模拟方式
vi.mock('react-hot-toast', () => {
  const mockToast = {
    loading: vi.fn(),
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  };
  return {
    __esModule: true,
    default: mockToast,
  };
});

vi.mock('nanoid', () => ({
  nanoid: () => 'test-id-123',
}));

describe('SignIn 组件', () => {
  const mockRouter = {
    push: vi.fn(),
  };
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (useUsers as any).mockReturnValue({
      loading: false,
      setUser: mockSetUser,
    });
  });

  it('应该切换到注册表单', () => {
    render(<SignIn />);

    // 点击切换到注册
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 使用更具体的选择器
    expect(screen.getByRole('heading', { name: '注册' })).toBeInTheDocument();

    // 验证额外的用户名字段出现
    expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument();

    // 验证按钮文本变化
    expect(screen.getByRole('button', { name: /^注册$/ })).toBeInTheDocument();

    // 验证链接文本变化
    expect(screen.getByText('已有账号？点击登录')).toBeInTheDocument();
  });

  it('使用正确凭据登录时调用API并重定向到看板', async () => {
    (login as any).mockResolvedValue({ id: 'user-123', name: 'Test User' });

    render(<SignIn />);

    // 填写登录表单
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'password123' },
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^登录$/ }));

    // 使用waitFor等待异步操作
    await waitFor(() => {
      // 验证加载状态
      expect(toast.loading).toHaveBeenCalledWith('登录中...');

      // 验证API调用
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      // 验证用户设置
      expect(mockSetUser).toHaveBeenCalledWith({ id: 'user-123', name: 'Test User' });

      // 验证成功提示
      expect(toast.success).toHaveBeenCalledWith('登录成功');

      // 验证重定向
      expect(mockRouter.push).toHaveBeenCalledWith('/board');
    });
  });

  it('登录失败时显示错误信息', async () => {
    (login as any).mockRejectedValue({ message: '用户名或密码输入有误' });

    render(<SignIn />);

    // 填写表单
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'wrongpassword' },
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^登录$/ }));

    await waitFor(() => {
      // 验证错误提示
      expect(toast.error).toHaveBeenCalledWith('用户名或密码输入有误');

      // 验证没有重定向
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('提交注册表单时调用API', async () => {
    (signup as any).mockResolvedValue({});

    render(<SignIn />);

    // 切换到注册表单
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 填写注册表单
    fireEvent.change(screen.getByPlaceholderText('用户名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'password123' },
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^注册$/ }));

    await waitFor(() => {
      // 验证加载状态
      expect(toast.loading).toHaveBeenCalledWith('注册中...');

      // 验证API调用
      expect(signup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });

      // 验证成功提示
      expect(toast.success).toHaveBeenCalledWith('前往邮箱查看');
    });
  });

  it('验证表单字段验证', async () => {
    render(<SignIn />);

    // 切换到注册表单
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 提交空表单
    fireEvent.click(screen.getByRole('button', { name: /^注册$/ }));

    await waitFor(() => {
      // 使用queryByText而不是getByText，因为某些错误消息可能不会同时显示
      const nameError = screen.queryByText('用户名不能为空');
      const emailError = screen.queryByText('请输入正确的邮箱');
      const passwordError = screen.queryByText('密码长度至少为6位');

      // 确保至少有一个错误消息显示
      expect(nameError || emailError || passwordError).not.toBeNull();
    });
  });

  it('点击试用按钮应跳转到试用页面', async () => {
    render(<SignIn />);

    // 点击试用按钮
    fireEvent.click(screen.getByText('前往试用'));

    await waitFor(() => {
      // 验证indexDB更新
      expect(indexDBChange).toHaveBeenCalledWith({
        type: 'add',
        data: expect.objectContaining({
          id: 'test-id-123',
          name: '试用',
        }),
      });

      // 验证重定向到试用页面
      expect(mockRouter.push).toHaveBeenCalledWith('/try/Edit/test-id-123');
    });
  });

  it('应该允许切换密码可见性', async () => {
    const { container } = render(<SignIn />);

    // 获取密码输入框
    const passwordInput = screen.getByPlaceholderText('密码');

    // 初始状态应为密码模式
    expect(passwordInput).toHaveAttribute('type', 'password');

    // 直接使用getByTestId获取密码切换图标
    const eyeIcon = screen.getByTestId('password-toggle');

    // 使用act包装状态更新操作
    await act(async () => {
      fireEvent.click(eyeIcon);
    });

    // 验证密码现在可见
    expect(passwordInput).toHaveAttribute('type', 'text');

    // 再次点击图标
    await act(async () => {
      fireEvent.click(screen.getByTestId('password-toggle'));
    });

    // 验证密码再次隐藏
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('当用户注册时用户名为空应显示错误', async () => {
    render(<SignIn />);

    // 切换到注册表单
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 填写表单但用户名为空
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'password123' },
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^注册$/ }));

    await waitFor(() => {
      // 验证用户名错误消息
      expect(screen.getByText('用户名不能为空')).toBeInTheDocument();
      expect(signup).not.toHaveBeenCalled();
    });
  });

  it('当用户加载中时应显示加载状态', () => {
    // 模拟用户加载状态
    (useUsers as any).mockReturnValue({
      loading: true,
      setUser: mockSetUser,
    });

    const { container } = render(<SignIn />);

    // 验证加载状态显示
    expect(screen.getByText('加载中...')).toBeInTheDocument();

    // 验证表单没有渲染
    expect(screen.queryByRole('heading', { name: '登录' })).not.toBeInTheDocument();
  });

  it('通过键盘事件切换登录/注册表单', async () => {
    render(<SignIn />);

    // 验证初始状态是登录
    expect(screen.getByRole('heading', { name: '登录' })).toBeInTheDocument();

    // 使用键盘事件切换到注册
    const switchElement = screen.getByText('没有账号？点击注册');
    fireEvent.keyDown(switchElement, { key: 'Enter' });

    // 验证切换到注册表单
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '注册' })).toBeInTheDocument();
    });

    // 再次使用键盘事件切换回登录
    const switchBackElement = screen.getByText('已有账号？点击登录');
    fireEvent.keyDown(switchBackElement, { key: 'Enter' });

    // 验证切换回登录表单
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '登录' })).toBeInTheDocument();
    });
  });

  it('注册失败时显示错误信息', async () => {
    (signup as any).mockRejectedValue({ message: '该邮箱已被注册' });

    render(<SignIn />);

    // 切换到注册表单
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 填写注册表单
    fireEvent.change(screen.getByPlaceholderText('用户名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'password123' },
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^注册$/ }));

    await waitFor(() => {
      // 验证错误提示
      expect(toast.error).toHaveBeenCalledWith('该邮箱已被注册');
    });
  });

  it('应验证密码长度上限并显示错误', async () => {
    render(<SignIn />);

    // 切换到注册表单
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 填写注册表单，密码超过16位但不超过20位
    fireEvent.change(screen.getByPlaceholderText('用户名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'test@example.com' },
    });

    // 验证密码输入框有maxLength限制
    const passwordInput = screen.getByPlaceholderText('密码');
    expect(passwordInput).toHaveAttribute('maxLength', '20');

    // 输入一个17位的密码，超过zod验证的16位限制，但不超过HTML的20位限制
    const seventeenCharPassword = '12345678901234567';
    fireEvent.change(passwordInput, {
      target: { value: seventeenCharPassword },
    });

    // 验证输入的密码长度确实是17位
    expect(passwordInput).toHaveValue(seventeenCharPassword);
    expect((passwordInput as HTMLInputElement).value).toHaveLength(17);

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^注册$/ }));

    await waitFor(() => {
      // 验证显示"密码长度最多为16位"的错误消息
      expect(screen.getByText('密码长度最多为16位')).toBeInTheDocument();
      expect(signup).not.toHaveBeenCalled();
    });
  });

  it('应接受恰好16位长度的密码', async () => {
    (signup as any).mockResolvedValue({});

    render(<SignIn />);

    // 切换到注册表单
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 填写注册表单，密码恰好16位
    fireEvent.change(screen.getByPlaceholderText('用户名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'test@example.com' },
    });

    // 输入一个16位的密码，恰好是zod验证的最大长度
    const sixteenCharPassword = '1234567890123456';
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: sixteenCharPassword },
    });

    // 验证输入的密码长度确实是16位
    const passwordInput = screen.getByPlaceholderText('密码');
    expect(passwordInput).toHaveValue(sixteenCharPassword);
    expect((passwordInput as HTMLInputElement).value).toHaveLength(16);

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^注册$/ }));

    await waitFor(() => {
      // 验证不显示密码长度错误消息
      expect(screen.queryByText('密码长度最多为16位')).not.toBeInTheDocument();

      // 验证API调用成功
      expect(signup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: sixteenCharPassword,
        username: 'testuser',
      });

      // 验证成功提示
      expect(toast.success).toHaveBeenCalledWith('前往邮箱查看');
    });
  });

  // 测试无效邮箱格式
  it('应验证邮箱格式并显示错误', async () => {
    render(<SignIn />);

    // 切换到注册表单
    fireEvent.click(screen.getByText('没有账号？点击注册'));

    // 填写表单，但邮箱格式无效
    fireEvent.change(screen.getByPlaceholderText('用户名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('请输入邮箱'), {
      target: { value: 'invalid-email' }, // 无效邮箱格式
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'password123' },
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /^注册$/ }));

    await waitFor(() => {
      // 验证显示邮箱错误消息
      expect(screen.getByText('请输入正确的邮箱')).toBeInTheDocument();
      expect(signup).not.toHaveBeenCalled();
    });
  });
});
