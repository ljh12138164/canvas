import { beforeEach, describe, expect, it } from 'vitest';
import { useSave } from '../save';

describe('useSave Store', () => {
  // 每次测试前重置 store 状态
  beforeEach(() => {
    useSave.setState({
      cloudSave: false,
      setCloudSave: useSave.getState().setCloudSave,
    });
  });

  it('初始状态应该是 cloudSave=false', () => {
    const state = useSave.getState();
    expect(state.cloudSave).toBe(false);
  });

  it('setCloudSave 方法应该更新 cloudSave 状态为 true', () => {
    // 调用 setCloudSave 方法
    useSave.getState().setCloudSave(true);

    // 验证状态更新
    const state = useSave.getState();
    expect(state.cloudSave).toBe(true);
  });

  it('setCloudSave 方法应该更新 cloudSave 状态为 false', () => {
    // 先设置为 true
    useSave.getState().setCloudSave(true);
    expect(useSave.getState().cloudSave).toBe(true);

    // 再设置为 false
    useSave.getState().setCloudSave(false);

    // 验证状态更新
    const state = useSave.getState();
    expect(state.cloudSave).toBe(false);
  });
});
