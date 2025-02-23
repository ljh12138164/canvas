/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://design.ljhboard.cn', // 替换成你的实际网站URL
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        sitemap: 'https://design.ljhboard.cn/sitemap.xml',
      },
    ],
  },

  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
};
