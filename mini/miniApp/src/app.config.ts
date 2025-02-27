export default defineAppConfig({
  pages: ['pages/index/index', 'pages/home/index', 'pages/user/index', 'pages/order/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  permission: {
    'scope.userInfo': {
      desc: '你的用户信息将用于小程序登录',
    },
  },
});
