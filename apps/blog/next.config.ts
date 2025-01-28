import nextra from 'nextra';

const withNextra = nextra({
  // 使用next的Image图片优化
  staticImage: true,
});

// You can include other Next.js configuration options here, in addition to Nextra settings:
export default withNextra({
  // ... Other Next.js config options
});
