/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://design.ljhboard.cn', // 替换成你的实际网站URL
  generateRobotsTxt: true,
  exclude: [
    '/admin*', // 排除所有管理员相关页面
    '/adminlogin*', // 排除管理员登录页面
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        sitemap: 'https://design.ljhboard.cn/sitemap.xml',
      },
    ],
  },
  additionalPaths: async () => {
    const result = [];
    const response = await fetch('https://www.ljhboard.cn/api/design/showPublic/seo');
    const posts = await response.json();
    posts.forEach((post) => {
      result.push({
        loc: `/board/formue/${post.id}`,
        lastmod: new Date().toISOString(),
        priority: 0.7,
      });
    });
    return result;
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
};
