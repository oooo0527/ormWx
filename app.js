App({
  globalData: {
    userInfo: null,
    isLogin: false,
    apiUrl: 'https://your-api-url.com',
    // 全局背景设置
    backgroundSettings: {
      type: 'gradient', // 'color', 'gradient', 'image'
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 默认紫色渐变
      customImage: '' // 自定义图片路径
    },
    backgroundChangeListener: null // 背景变化监听器
  },

  onLaunch: function () {
    // 小程序启动时检查登录状态
    this.checkLoginStatus();

    // 从本地存储获取背景设置
    const savedBackground = wx.getStorageSync('backgroundSettings');
    if (savedBackground) {
      this.globalData.backgroundSettings = savedBackground;
    }
  },

  onShow: function () {
    // 每次小程序启动或从后台进入前台时执行
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

  // 更新全局背景设置
  updateBackgroundSettings: function (settings) {
    this.globalData.backgroundSettings = settings;
    wx.setStorageSync('backgroundSettings', settings);

    // 通知所有页面更新背景
    if (this.globalData.backgroundChangeListener) {
      this.globalData.backgroundChangeListener(settings);
    }
  },

  // 获取当前背景样式
  getCurrentBackgroundStyle: function () {
    const settings = this.globalData.backgroundSettings;
    if (settings.type === 'image' && settings.customImage) {
      return `background-image: url(${settings.customImage}); background-size: cover; background-position: center;`;
    } else {
      return `background: ${settings.value};`;
    }
  }
})