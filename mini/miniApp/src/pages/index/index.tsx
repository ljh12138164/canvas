import { Button, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import styles from './index.module.css';

export default function Index() {
  const [, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 页面加载时的逻辑‘
    Taro.checkSession({
      success: (data) => {
        setUserInfo(data);
        // session_key 未过期,用户仍然登录中
        setLoading(false);
        Taro.navigateTo({ url: '/pages/home/index' });
      },
      fail: () => {
        // session_key 已过期,需要重新登录
        Taro.showToast({
          title: '登录失败',
          icon: 'error',
        });
        setLoading(false);
      },
    });
  }, []);

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
            Taro.navigateTo({
              url: '/pages/home/index',
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
  if (loading) {
    return (
      <View className={styles.index}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.index}>
      <View className={styles.loginContainer}>
        <View className={styles.loginHeader}>
          <Text className={styles.loginTitle}>欢迎使用</Text>
          <Text className={styles.loginSubtitle}>请授权登录以继续</Text>
        </View>
      </View>
      <Button onClick={handleLogin}>微信登录</Button>
    </View>
  );
}
