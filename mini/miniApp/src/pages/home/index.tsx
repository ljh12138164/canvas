import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components';
import { useState } from 'react';
import styles from './index.module.css';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const Home = () => {
  const [banners] = useState([
    { id: 1, image: 'https://placeholder.com/800x400' },
    { id: 2, image: 'https://placeholder.com/800x400' },
    { id: 3, image: 'https://placeholder.com/800x400' },
  ]);

  const [categories] = useState([
    { id: 1, name: '新品上市', icon: '🆕' },
    { id: 2, name: '热卖商品', icon: '🔥' },
    { id: 3, name: '优惠活动', icon: '💰' },
    { id: 4, name: '全部分类', icon: '📑' },
  ]);

  const [products] = useState<Product[]>([
    {
      id: 1,
      title: '商品名称1',
      price: 99.9,
      image: 'https://placeholder.com/300',
    },
    {
      id: 2,
      title: '商品名称2',
      price: 199.9,
      image: 'https://placeholder.com/300',
    },
    {
      id: 3,
      title: '商品名称3',
      price: 299.9,
      image: 'https://placeholder.com/300',
    },
    {
      id: 4,
      title: '商品名称4',
      price: 399.9,
      image: 'https://placeholder.com/300',
    },
  ]);

  return (
    <View className={styles.container}>
      <Swiper className={styles.swiper} indicatorDots autoplay circular>
        {banners.map((banner) => (
          <SwiperItem key={banner.id}>
            <Image src={banner.image} className={styles.swiperImage} />
          </SwiperItem>
        ))}
      </Swiper>

      <View className={styles.categories}>
        {categories.map((category) => (
          <View key={category.id} className={styles.categoryItem}>
            <Text className={styles.categoryIcon}>{category.icon}</Text>
            <Text className={styles.categoryName}>{category.name}</Text>
          </View>
        ))}
      </View>

      <View className={styles.productSection}>
        <View className={styles.sectionTitle}>
          <Text>热门商品111</Text>
        </View>
        <View className={styles.productList}>
          {products.map((product) => (
            <View key={product.id} className={styles.productItem}>
              <Image src={product.image} className={styles.productImage} />
              <Text className={styles.productTitle}>{product.title}</Text>
              <Text className={styles.productPrice}>¥{product.price}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Home;
