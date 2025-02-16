import { Inter } from 'next/font/google';
// import localFont from 'next/font/local';
const myFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// const myFont = localFont({
//   src: [
//     {
//       path: '../../fonts/GenJyuuGothicL-Bold.ttf',
//       weight: '400',
//       style: 'regular',
//     },
//     {
//       path: '../../fonts/GenJyuuGothicL-Bold.ttf',
//       weight: '500',
//       style: 'medium',
//     },
//     {
//       path: '../../fonts/GenJyuuGothicL-Bold.ttf',
//       weight: '600',
//       style: 'normal',
//     },
//     {
//       path: '../../fonts/GenJyuuGothicL-Bold.ttf',
//       weight: '700',
//       style: 'bold',
//     },
//   ],
//   variable: '--font-genjyuu',
// });
export { myFont };
