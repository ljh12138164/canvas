import { create } from 'zustand';

interface DatePickerStore {
  startDate: Date | undefined;
  endDate: Date | undefined;
  dates: string[];
  loading: boolean;
  startTime: Date | undefined;
  endTime: Date | undefined;
  setDates: (dates: string[]) => void;
  setLoading: (loading: boolean) => void;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setStartTime: (time: Date | undefined) => void;
  setEndTime: (time: Date | undefined) => void;
}
export const useDatePicker = create<DatePickerStore>((set) => ({
  startDate: undefined,
  endDate: undefined,
  dates: [],
  loading: true,
  startTime: undefined,
  endTime: undefined,
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setStartTime: (time) => set({ startTime: time }),
  setEndTime: (time) => set({ endTime: time }),
  setDates: (dates) => set({ dates }),
  setLoading: (loading) => set({ loading }),
}));
