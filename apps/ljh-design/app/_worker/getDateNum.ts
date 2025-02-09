import dayjs from 'dayjs';
/**
 * ### 获取开始到结束时间每天的数量,默认1个月
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 每天的数量
 */

self.onmessage = (e: MessageEvent<{ startTime: Date; endTime: Date }>) => {
  const { startTime, endTime } = e.data;
  let start: Date | number | undefined = startTime;
  let end: Date | number | undefined = endTime;
  // 如果没设置开始时间，设置为1个月前
  if (!startTime && !endTime) start = dayjs().toDate().getTime() - 1000 * 60 * 60 * 24 * 30 * 1;
  // 如果没设置结束时间，设置为今天
  if (!endTime) end = dayjs().toDate();
  // 如果设置了结束时间，没有设置开始时间，设置为1个月前
  if (endTime && !startTime) start = dayjs(endTime).subtract(1, 'month').toDate();
  // 如果设置了开始时间和结束时间为同一天，则设置为开始时间
  // if (startTime && endTime && dayjs(startTime).isSame(endTime, 'day')) {
  //   end = dayjs(startTime).add(1, 'day').toDate();
  // }
  const date = [];
  let currentDate = dayjs(start);
  const endDate = dayjs(end);
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    date.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day'); // 将结果赋值给 currentDate
  }
  // date.push(endDate.format('YYYY-MM-DD'));
  self.postMessage(date);
};
