import type { TaskWithWorkspace } from '@/types/workspace';
import { addMonths, format, getDay, parse, startOfWeek, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventCard } from './EventCard';
import { ToolbarCard } from './ToolbarCard';
const locales = {
  'zh-CN': zhCN,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export const BigCalendar = ({ data }: { data: TaskWithWorkspace[] }) => {
  // 选择日期
  const [value, setValue] = useState<Date>(
    data.length > 0 ? new Date(data[0].lastTime) : new Date(),
  );
  // 事件
  const event = data.map((task) => ({
    id: task.id,
    title: task.name,
    start: new Date(task.lastTime),
    end: new Date(task.lastTime),
    project: task.projects,
    workspace: task.workspace,
    status: task.status,
    assignee: task.assigneeId,
  }));
  // 设置跳转
  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      // 上个月
      setValue(subMonths(value, 1));
    } else if (action === 'NEXT') {
      // 下个月
      setValue(addMonths(value, 1));
    } else if (action === 'TODAY') {
      // 今天
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      events={event}
      views={{ month: true }}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      style={{
        height: '100%',
        padding: '1rem',
        borderRadius: '0.5rem',
      }}
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      min={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
      formats={{
        // 星期
        weekdayFormat: (date) => {
          const days = ['日', '一', '二', '三', '四', '五', '六'];
          return days[date.getDay()];
        },
        // 日期
        dateFormat: (date) => {
          return date.getDate().toString();
        },
        // 月份
        monthHeaderFormat: (date) => {
          return `${date.getFullYear()}年${date.getMonth() + 1}月`;
        },
        // 日期
        dayHeaderFormat: (date) => {
          return `${date.getMonth() + 1}月${date.getDate()}日 星期${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}`;
        },
        // 日期范围
        dayRangeHeaderFormat: ({ start, end }) => {
          return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
        },
      }}
      components={{
        eventWrapper: ({ event }) => <EventCard event={event} />,
        toolbar: () => <ToolbarCard data={value} onNavigator={handleNavigate} />,
      }}
      date={value}
    />
  );
};
