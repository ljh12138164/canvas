import { Image, Text, View } from '@tarojs/components';
import { useState } from 'react';
import styles from './index.module.css';

interface UserInfo {
  avatar: string;
  nickname: string;
  phone: string;
}

const User = () => {
  const [userInfo] = useState<UserInfo>({
    avatar: 'https://placeholder.com/150',
    nickname: '用户昵称',
    phone: '138****8888',
  });

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={userInfo.avatar} />
        <View className={styles.info}>
          <Text className={styles.nickname}>{userInfo.nickname}</Text>
          <Text className={styles.phone}>{userInfo.phone}</Text>
        </View>
      </View>

      <View className={styles.menuList}>
        <View className={styles.menuItem}>
          <Text>我的订单</Text>
        </View>
        <View className={styles.menuItem}>
          <Text>收货地址</Text>
        </View>
        <View className={styles.menuItem}>
          <Text>联系客服</Text>
        </View>
      </View>
    </View>
  );
};

export default User;
