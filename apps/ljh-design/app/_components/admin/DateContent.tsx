import { useDatePicker } from '@/app/_store/datePicker';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { zhCN } from 'react-day-picker/locale';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import AdminPeding from './AdminPeding';
export default function DateContent({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { startTime, endTime, setStartTime, setEndTime, setDates, setLoading, loading } =
    useDatePicker();
  // web worker
  const [dateWorker, setDateWorker] = useState<Worker>();
  // 自定义ref

  const handleStartSelect = (date: Date | undefined) => {
    toast.dismiss();
    if (!date) setStartTime(undefined);
    else {
      if (endTime && date > endTime) {
        toast.error('开始时间不能大于结束时间');
        setStartTime(endTime);
      } else if (date.getTime() > new Date().getTime()) {
        toast.error('开始时间不能大于当前时间');
        setStartTime(new Date());
      } else {
        setStartTime(date);
      }
    }
  };
  // 创建web worker
  useEffect(() => {
    const worker = new Worker(new URL('@/app/_worker/getDateNum.ts', import.meta.url));
    setDateWorker(worker);
    worker.onmessage = (e: MessageEvent<string[]>) => {
      setLoading(false);
      setDates(e.data);
    };

    return () => {
      worker.terminate();
    };
  }, []);
  // 发送开始和结束时间,获取日期数组
  useEffect(() => {
    if (dateWorker) {
      // 发送开始和结束时间,获取日期数组
      dateWorker.postMessage({ startTime, endTime });
      setLoading(true);
    }
  }, [startTime, endTime, dateWorker]);

  const handleEndSelect = (date: Date | undefined) => {
    toast.dismiss();

    if (!date) setEndTime(undefined);
    else {
      if (startTime && dayjs(date).isBefore(dayjs(startTime))) {
        toast.error('结束时间不能小于开始时间');
        setEndTime(startTime);
      } else if (date.getTime() > new Date().getTime()) {
        toast.error('开始时间不能大于当前时间');
        setEndTime(new Date());
      } else {
        setEndTime(date);
      }
    }
  };
  if (loading) return <AdminPeding title={title} />;

  return (
    <main className="w-full h-full flex flex-col gap-4 px-4 py-2">
      <nav className="h-10 flex p-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {/* 时间选择 */}
        <section className="ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <span>开始时间</span>
                {startTime ? `: ${dayjs(startTime).format('YYYY-MM-DD')}` : ''}
                {startTime && (
                  <div
                    className="text-xs text-muted-foreground"
                    onClick={() => setStartTime(undefined)}
                  >
                    <X />
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[20rem]">
              <DayPicker
                mode="single"
                locale={zhCN}
                selected={startTime}
                onSelect={handleStartSelect}
                footer={
                  <div className="mt-2">
                    <div>
                      开始时间: {startTime ? dayjs(startTime).format('YYYY-MM-DD') : '未选择'}
                    </div>
                    <div>结束时间: {endTime ? dayjs(endTime).format('YYYY-MM-DD') : '未选择'}</div>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>

          <span className="text-xl text-muted-foreground mx-2">-</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <span>结束时间</span>
                {endTime ? `: ${dayjs(endTime).format('YYYY-MM-DD')}` : ''}
                {endTime && (
                  <div
                    className="text-xs text-muted-foreground"
                    onClick={() => setEndTime(undefined)}
                  >
                    <X />
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[20rem]">
              <DayPicker
                mode="single"
                locale={zhCN}
                selected={endTime}
                onSelect={handleEndSelect}
                footer={
                  <div className="mt-2">
                    <div>
                      开始时间: {startTime ? dayjs(startTime).format('YYYY-MM-DD') : '未选择'}
                    </div>
                    <div>结束时间: {endTime ? dayjs(endTime).format('YYYY-MM-DD') : '未选择'}</div>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>
        </section>
      </nav>
      <Separator />
      {children}
    </main>
  );
}
