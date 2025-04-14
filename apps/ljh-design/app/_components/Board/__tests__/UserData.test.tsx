import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChangeUserData from '../../Board/ChangeUserData';

// 导入图表组件
import { AreaChart } from '../../Echarts/AreaChart';
import { LegendChart } from '../../Echarts/LegendChart';
import { LineCharts } from '../../Echarts/LineCharts';
import { PicChart } from '../../Echarts/PicChart';

// ========== 用户数据相关模拟 ==========

// 模拟数据
const mockUserData = {
  user: {
    id: 'test-user-id',
    user_metadata: {
      name: '测试用户',
      image: 'https://example.com/test-image.jpg',
      region: '440000,440100', // 广东省,广州市
    },
    email: 'test@example.com',
  },
};

// 模拟更新用户数据的函数
const mockUpdateUser = vi.fn();
const mockChangePassword = vi.fn();
const mockLogout = vi.fn();

// 模拟路由
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// 模拟文件上传
vi.mock('@/app/_database/user', () => ({
  updateCurrentUser: vi.fn(async () => ({
    user: {
      user_metadata: {
        name: '更新后的用户名',
        image: 'https://example.com/updated-image.jpg',
        region: '110000,110100',
      },
    },
  })),
  logout: vi.fn(async () => {}),
}));

// 模拟toast通知
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// 模拟用户状态
vi.mock('@/app/_store/auth', () => ({
  useUser: () => ({
    user: mockUserData,
    setUser: vi.fn(),
  }),
}));

// 模拟用户数据修改API
vi.mock('@/app/_hook/query/useUserChange', () => ({
  useUserChange: () => ({
    mutate: mockUpdateUser,
    isPending: false,
  }),
  useUserChangePassword: () => ({
    changePassword: mockChangePassword,
    changePasswordPending: false,
  }),
}));

// 模拟地图数据
vi.mock('@/app/_hook/query/useMap', () => ({
  useMap: () => ({
    data: {
      districts: [
        {
          name: '广东省',
          adcode: '440000',
          districts: [
            {
              name: '广州市',
              adcode: '440100',
            },
            {
              name: '深圳市',
              adcode: '440300',
            },
          ],
        },
        {
          name: '北京市',
          adcode: '110000',
          districts: [
            {
              name: '北京市',
              adcode: '110100',
            },
          ],
        },
      ],
    },
    isLoading: false,
  }),
}));

// 模拟组件
vi.mock('../../Comand/AvatarImage', () => ({
  default: (props: any) => {
    const { src, alt, jump, ...rest } = props;
    // biome-ignore lint/a11y/useAltText: <explanation>
    return <img src={src || ''} alt={alt || '用户头像'} data-testid="avatar-image" {...rest} />;
  },
}));

// ========== 图表相关模拟 ==========

// 模拟Recharts库
vi.mock('recharts', () => ({
  AreaChart: vi.fn(({ children }) => <div data-testid="area-chart">{children}</div>),
  LineChart: vi.fn(({ children }) => <div data-testid="line-chart">{children}</div>),
  PieChart: vi.fn(({ children }) => <div data-testid="pie-chart">{children}</div>),
  BarChart: vi.fn(({ children }) => <div data-testid="bar-chart">{children}</div>),
  Area: vi.fn(() => <div data-testid="area-component" />),
  Line: vi.fn(() => <div data-testid="line-component" />),
  Pie: vi.fn(({ children }) => <div data-testid="pie-component">{children}</div>),
  Bar: vi.fn(() => <div data-testid="bar-component" />),
  CartesianGrid: vi.fn(() => <div data-testid="cartesian-grid" />),
  XAxis: vi.fn(() => <div data-testid="x-axis" />),
  LabelList: vi.fn(({ children }) => <div data-testid="label-list">{children}</div>),
  ChartTooltip: vi.fn(({ children }) => <div data-testid="chart-tooltip">{children}</div>),
}));

// 模拟Chart UI组件
vi.mock('@/app/_components/ui/chart', () => ({
  ChartContainer: vi.fn(({ children, className }) => (
    <div data-testid="chart-container" className={className}>
      {children}
    </div>
  )),
  ChartTooltip: vi.fn(({ children, content }) => (
    <div data-testid="chart-tooltip">{content || children}</div>
  )),
  ChartTooltipContent: vi.fn(() => <div data-testid="chart-tooltip-content" />),
  ChartLegend: vi.fn(({ children, content }) => (
    <div data-testid="chart-legend">{content || children}</div>
  )),
  ChartLegendContent: vi.fn(() => <div data-testid="chart-legend-content" />),
}));

// 模拟Card UI组件
vi.mock('@/app/_components/ui/card', () => ({
  Card: vi.fn(({ children }) => <div data-testid="card">{children}</div>),
  CardHeader: vi.fn(({ children, className }) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  )),
  CardTitle: vi.fn(({ children }) => <div data-testid="card-title">{children}</div>),
  CardDescription: vi.fn(({ children }) => <div data-testid="card-description">{children}</div>),
  CardContent: vi.fn(({ children, className }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  )),
  CardFooter: vi.fn(({ children }) => <div data-testid="card-footer">{children}</div>),
}));

// 模拟dayjs
vi.mock('dayjs', () => ({
  default: (date: any) => ({
    format: (format: any) => {
      if (!date) return '';
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
    },
  }),
}));

// 模拟图表数据
const mockStartDate = new Date(2023, 0, 1); // 2023-01-01
const mockEndDate = new Date(2023, 0, 31); // 2023-01-31

const mockChartData = [
  {
    date: '2023-01-01',
    templates: 10,
    material: 5,
    board: 8,
    upvotes: 4,
    collections: 2,
    show: 6,
  },
  {
    date: '2023-01-02',
    templates: 15,
    material: 7,
    board: 10,
    upvotes: 5,
    collections: 3,
    show: 8,
  },
  {
    date: '2023-01-03',
    templates: 12,
    material: 6,
    board: 9,
    upvotes: 6,
    collections: 4,
    show: 7,
  },
];

const mockPieChartData = [
  {
    label: 'templates',
    type: 'templates',
    visitors: 37,
    fill: 'hsl(var(--chart-1))',
  },
  {
    label: 'material',
    type: 'material',
    visitors: 18,
    fill: 'hsl(var(--chart-2))',
  },
  { label: 'board', type: 'board', visitors: 27, fill: 'hsl(var(--chart-3))' },
];

// ========== 测试用例 ==========

describe('用户界面测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // ----- 用户数据编辑测试 -----
  describe('用户数据编辑测试', () => {
    // it('正确渲染用户数据编辑组件', () => {
    //   render(<ChangeUserData data={mockUserData as any} />);

    //   // 检查基本UI元素
    //   expect(screen.getByText('用户姓名')).toBeInTheDocument();
    //   expect(screen.getByText('用户地区')).toBeInTheDocument();
    //   expect(screen.getByText('用户头像')).toBeInTheDocument();
    //   expect(screen.getByText('密码')).toBeInTheDocument();

    //   // 检查用户数据是否正确显示
    //   const nameInput = screen.getByPlaceholderText('本站昵称');
    //   expect(nameInput).toHaveValue('测试用户');

    //   // 检查地区信息
    //   expect(screen.getByText('广东省')).toBeInTheDocument();
    //   expect(screen.getByText('广州市')).toBeInTheDocument();

    //   // 检查头像
    //   const avatarImage = screen.getByTestId('avatar-image');
    //   expect(avatarImage).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    // });

    it('能够修改用户名', async () => {
      render(<ChangeUserData data={mockUserData as any} />);

      // 找到用户名输入框
      const nameInput = screen.getByPlaceholderText('本站昵称');

      // 修改用户名
      fireEvent.change(nameInput, { target: { value: '新用户名' } });

      // 点击保存按钮
      const saveButtons = screen.getAllByText('保存');
      fireEvent.click(saveButtons[0]);

      // 检查更新函数是否被调用
      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(
          { json: { name: '新用户名' } },
          expect.anything(),
        );
      });
    });

    it('能够通过地区选择器修改地区', async () => {
      render(<ChangeUserData data={mockUserData as any} />);

      // 点击选择地区按钮
      const selectRegionButton = screen.getByText('选择地区');
      fireEvent.click(selectRegionButton);

      // 检查弹出的选择框
      expect(screen.getByText('选择地区', { selector: 'h2' })).toBeInTheDocument();
    });

    it('能够点击头像触发头像编辑', async () => {
      render(<ChangeUserData data={mockUserData as any} />);

      // 找到头像元素
      const avatarImage = screen.getByTestId('avatar-image');

      // 模拟点击
      fireEvent.click(avatarImage);

      // 检查是否显示文件上传相关元素
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('能够输入并验证密码', async () => {
      render(<ChangeUserData data={mockUserData as any} />);

      // 找到密码输入框
      const passwordInputs = screen.getAllByRole('textbox').slice(-2);
      const newPasswordInput = passwordInputs[0];
      const repeatPasswordInput = passwordInputs[1];

      // 输入密码
      fireEvent.change(newPasswordInput, {
        target: { value: 'newPassword123' },
      });
      fireEvent.change(repeatPasswordInput, {
        target: { value: 'newPassword123' },
      });

      // 点击保存按钮
      const saveButtons = screen.getAllByText('保存');
      fireEvent.click(saveButtons[3]); // 密码保存按钮是第四个

      // 检查密码更新函数是否被调用
      await waitFor(() => {
        expect(mockChangePassword).toHaveBeenCalledWith(
          { json: { password: 'newPassword123' } },
          expect.anything(),
        );
      });
    });
  });

  // ----- 图表组件测试 -----
  describe('图表组件测试', () => {
    // 面积图测试
    describe('面积图测试', () => {
      it('正确渲染面积图组件', () => {
        render(
          <AreaChart
            startTime={mockStartDate}
            endTime={mockEndDate}
            selectedType={['templates', 'material', 'board']}
            genData={mockChartData}
          />,
        );

        // 检查图表容器是否渲染
        expect(screen.getByTestId('card')).toBeInTheDocument();
        expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      });

      // it('显示无数据信息当数据为空时', () => {
      //   render(
      //     <AreaChart
      //       startTime={mockStartDate}
      //       endTime={mockEndDate}
      //       selectedType={['templates', 'material', 'board']}
      //       genData={[]}
      //     />,
      //   );

      //   expect(screen.getByText('没有数据')).toBeInTheDocument();
      // });
    });

    // 折线图测试
    describe('折线图测试', () => {
      it('正确渲染折线图组件', () => {
        render(
          <LineCharts
            startTime={mockStartDate}
            endTime={mockEndDate}
            selectedType={['templates', 'material', 'board']}
            genData={mockChartData}
          />,
        );

        // 检查图表容器是否渲染
        expect(screen.getByTestId('card')).toBeInTheDocument();
        expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      });

      // it('显示无数据信息当数据为空时', () => {
      //   render(
      //     <LineCharts
      //       startTime={mockStartDate}
      //       endTime={mockEndDate}
      //       selectedType={['templates', 'material', 'board']}
      //       genData={[]}
      //     />,
      //   );

      //   expect(screen.getByText('没有数据')).toBeInTheDocument();
      // });
    });

    // 饼图测试
    describe('饼图测试', () => {
      it('正确渲染饼图组件', () => {
        render(
          <PicChart
            startTime={mockStartDate}
            endTime={mockEndDate}
            genData={mockPieChartData}
            type="user"
          />,
        );

        // 检查图表容器是否渲染
        expect(screen.getByTestId('card')).toBeInTheDocument();
        expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      });

      // it('显示无数据信息当数据为空时', () => {
      //   render(
      //     <PicChart startTime={mockStartDate} endTime={mockEndDate} genData={[]} type="user" />,
      //   );

      //   expect(screen.getByText('无数据')).toBeInTheDocument();
      // });

      // it('根据类型使用不同配置', () => {
      //   // Design类型
      //   render(
      //     <PicChart
      //       startTime={mockStartDate}
      //       endTime={mockEndDate}
      //       genData={mockPieChartData}
      //       type="design"
      //     />,
      //   );

      //   // 验证设计图表已渲染
      //   expect(screen.getByTestId('card')).toBeInTheDocument();

      //   cleanup();

      //   // Any类型
      //   render(
      //     <PicChart
      //       startTime={mockStartDate}
      //       endTime={mockEndDate}
      //       genData={mockPieChartData}
      //       type="any"
      //     />,
      //   );

      //   // 验证综合图表已渲染
      //   expect(screen.getByTestId('card')).toBeInTheDocument();
      // });
    });

    // 堆叠面积图测试
    describe('堆叠面积图测试', () => {
      it('正确渲染堆叠面积图组件', () => {
        render(
          <LegendChart
            startTime={mockStartDate}
            endTime={mockEndDate}
            selectedType={[
              {
                dataKey: 'templates',
                type: 'monotone',
                fill: 'url(#fillChart1)',
                stroke: 'var(--chart-1)',
                stackId: '1',
              },
              {
                dataKey: 'material',
                type: 'monotone',
                fill: 'url(#fillChart2)',
                stroke: 'var(--chart-2)',
                stackId: '1',
              },
              {
                dataKey: 'board',
                type: 'monotone',
                fill: 'url(#fillChart3)',
                stroke: 'var(--chart-3)',
                stackId: '1',
              },
            ]}
            genData={mockChartData}
          />,
        );

        // 检查图表容器是否渲染
        expect(screen.getByTestId('card')).toBeInTheDocument();
        expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      });

      // it('显示无数据信息当数据为空时', () => {
      //   render(
      //     <LegendChart
      //       startTime={mockStartDate}
      //       endTime={mockEndDate}
      //       selectedType={[
      //         {
      //           dataKey: 'templates',
      //           type: 'monotone',
      //           fill: 'url(#fillChart1)',
      //           stroke: 'var(--chart-1)',
      //           stackId: '1',
      //         },
      //       ]}
      //       genData={[]}
      //     />,
      //   );

      //   expect(screen.getByText('没有数据')).toBeInTheDocument();
      // });
    });
  });
});
