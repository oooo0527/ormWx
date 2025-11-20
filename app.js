App({
  globalData: {
    userInfo: null,
    isLogin: false,
    apiUrl: 'https://your-api-url.com'
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      // 初始化云开发环境，支持动态选择环境
      const envId = wx.getStorageSync('cloudEnvId') || 'cloud1-5gzybpqcd24b2b58';
      wx.cloud.init({
        env: envId,
        traceUser: true,
      });
    }
    // 小程序启动时检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
    }
  },

  // 用户登录
  login: function (username, password, callback) {
    // 这里应该调用后端API进行登录验证
    // 模拟登录成功
    const userInfo = {
      id: 1,
      username: username,
      nickname: '用户昵称',
      avatar: '/images/avatar.png'
    };

    // 存储用户信息
    wx.setStorageSync('userInfo', userInfo);
    this.globalData.userInfo = userInfo;
    this.globalData.isLogin = true;

    if (callback) callback(true);
  },

  // 用户登出
  logout: function () {
    wx.removeStorageSync('userInfo');
    this.globalData.userInfo = null;
    this.globalData.isLogin = false;
  }
})