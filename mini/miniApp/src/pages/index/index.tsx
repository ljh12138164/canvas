import { Button, Text, View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import './index.css';
import { useState } from 'react';

export default function Index() {
  const [, setUserInfo] = useState<any>(null);
  useLoad(() => {
    // 页面加载时的逻辑
  });

  const handleLogin = () => {
    Taro.login({
      success: async (res) => {
        if (res.code) {
          try {
            const userInfo = await Taro.getUserInfo({
              lang: 'zh_CN',
            });
            setUserInfo(userInfo);
            // console.log(userInfo.userInfo.nickName);
            Taro.showToast({
              title: '登录成功',
              icon: 'success',
            });
          } catch (error) {
            Taro.showToast({
              title: '登录失败',
              icon: 'error',
            });
          }
        }
      },
    });
  };

  return (
    <View className="index">
      <Text>Hello world!</Text>
      <Button onClick={handleLogin}>微信登录</Button>
    </View>
  );
}
