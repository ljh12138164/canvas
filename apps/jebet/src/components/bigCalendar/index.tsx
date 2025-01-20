import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { zhCN } from "date-fns/locale";
import { TaskWithWorkspace } from "@/types/workspace";
import { useState } from "react";
const locales = {
  "zh-CN": zhCN,
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
    data.length > 0 ? new Date(data[0].lastTime) : new Date()
  );
  // 事件
  const event = data.map((task) => ({
    title: task.name,
    start: new Date(task.lastTime),
    end: new Date(task.lastTime),
    project: task.project,
    workspace: task.workspace,
    status: task.status,
    assignee: task.assigneeId,
  }));
  // 设置跳转
  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      // 上个月
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      // 下个月
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
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
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      min={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) => {
          return localizer?.format(date, "EEEEE", culture) ?? "";
        },
      }}
      //   onNavigate={handleNavigate}
      //   value={value}
    />
  );
};
