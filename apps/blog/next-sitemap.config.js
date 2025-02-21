/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://blog.ljhboard.cn', // 替换成你的实际网站URL
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
        sitemap: 'https://blog.ljhboard.cn/sitemap.xml',
      },
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
};
