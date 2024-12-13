import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const myFont = localFont({
  src: [
    {
      path: '../../app/fonts/GenJyuuGothicL-Regular.ttf',
      weight: '400',
      style: 'regular',
    },
    {
      path: '../../app/fonts/GenJyuuGothicL-Medium.ttf',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../../app/fonts/GenJyuuGothicL-Normal.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../app/fonts/GenJyuuGothicL-Bold.ttf',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--font-genjyuu',
});
export { inter, myFont };
