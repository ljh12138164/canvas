import { beforeEach, describe, expect, it } from 'vitest';
import { useDatePicker } from '../datePicker';

describe('useDatePicker Store', () => {
  // 每次测试前重置 store 状态
  beforeEach(() => {
    useDatePicker.setState({
      startDate: undefined,
      endDate: undefined,
      dates: [],
      loading: true,
      startTime: undefined,
      endTime: undefined,
      setStartDate: useDatePicker.getState().setStartDate,
      setEndDate: useDatePicker.getState().setEndDate,
      setStartTime: useDatePicker.getState().setStartTime,
      setEndTime: useDatePicker.getState().setEndTime,
      setDates: useDatePicker.getState().setDates,
      setLoading: useDatePicker.getState().setLoading,
    });
  });

  it('初始状态应该是所有日期为undefined且loading为true', () => {
    const state = useDatePicker.getState();
    expect(state.startDate).toBeUndefined();
    expect(state.endDate).toBeUndefined();
    expect(state.dates).toEqual([]);
    expect(state.loading).toBe(true);
    expect(state.startTime).toBeUndefined();
    expect(state.endTime).toBeUndefined();
  });

  it('setStartDate方法应该更新startDate', () => {
    const testDate = new Date('2023-04-01');
    useDatePicker.getState().setStartDate(testDate);

    const state = useDatePicker.getState();
    expect(state.startDate).toEqual(testDate);
    // 其他状态不变
    expect(state.endDate).toBeUndefined();
    expect(state.loading).toBe(true);
  });

  it('setEndDate方法应该更新endDate', () => {
    const testDate = new Date('2023-04-15');
    useDatePicker.getState().setEndDate(testDate);

    const state = useDatePicker.getState();
    expect(state.endDate).toEqual(testDate);
    // 其他状态不变
    expect(state.startDate).toBeUndefined();
    expect(state.loading).toBe(true);
  });

  it('setStartTime方法应该更新startTime', () => {
    const testTime = new Date('2023-04-01T10:30:00');
    useDatePicker.getState().setStartTime(testTime);

    const state = useDatePicker.getState();
    expect(state.startTime).toEqual(testTime);
    // 其他状态不变
    expect(state.endTime).toBeUndefined();
    expect(state.loading).toBe(true);
  });

  it('setEndTime方法应该更新endTime', () => {
    const testTime = new Date('2023-04-15T18:45:00');
    useDatePicker.getState().setEndTime(testTime);

    const state = useDatePicker.getState();
    expect(state.endTime).toEqual(testTime);
    // 其他状态不变
    expect(state.startTime).toBeUndefined();
    expect(state.loading).toBe(true);
  });

  it('setDates方法应该更新日期数组', () => {
    const testDates = ['2023-04-01', '2023-04-02', '2023-04-03'];
    useDatePicker.getState().setDates(testDates);

    const state = useDatePicker.getState();
    expect(state.dates).toEqual(testDates);
    // 其他状态不变
    expect(state.loading).toBe(true);
  });

  it('setLoading方法应该更新loading状态', () => {
    useDatePicker.getState().setLoading(false);

    const state = useDatePicker.getState();
    expect(state.loading).toBe(false);
  });

  it('可以组合使用多个setter方法', () => {
    const startDate = new Date('2023-04-01');
    const endDate = new Date('2023-04-15');
    const dates = ['2023-04-01', '2023-04-02', '2023-04-03'];

    // 依次设置多个状态
    useDatePicker.getState().setStartDate(startDate);
    useDatePicker.getState().setEndDate(endDate);
    useDatePicker.getState().setDates(dates);
    useDatePicker.getState().setLoading(false);

    // 验证所有状态都被正确更新
    const state = useDatePicker.getState();
    expect(state.startDate).toEqual(startDate);
    expect(state.endDate).toEqual(endDate);
    expect(state.dates).toEqual(dates);
    expect(state.loading).toBe(false);
  });
});
