App({
  globalData: {
    userInfo: null,
    isLogin: false,
    menuList: [],
    contentList: [],
    musicList: [],
    apiUrl: 'https://your-api-url.com',
    // 全局背景设置
    backgroundSettings: {
      type: 'gradient', // 'color', 'gradient', 'image'
      value: 'linear-gradient(135deg, #0c1117 0%, #f48eb5 100%)', // 高级黑到淡粉渐变
      customImage: '' // 自定义图片路径
    },
    backgroundChangeListener: null // 背景变化监听器
  },

  onLaunch: function () {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-5gzybpqcd24b2b58',
        traceUser: true,
      });
    }

    // 小程序启动时检查登录状态
    this.checkLoginStatus();

    // 从本地存储获取背景设置
    const savedBackground = wx.getStorageSync('backgroundSettings');
    if (savedBackground) {
      this.globalData.backgroundSettings = savedBackground;
    }

    // 检查隐私协议同意状态
    const privacyAgreed = wx.getStorageSync('privacyAgreed');
    if (privacyAgreed) {
      // 获取微信用户信息
      this.getWechatUserInfo();
    }
  },

  // 获取微信用户信息
  getWechatUserInfo: function () {
    // 检查是否已同意隐私协议
    const privacyAgreed = wx.getStorageSync('privacyAgreed');
    if (!privacyAgreed) {
      console.log('未同意隐私协议，无法获取用户信息');
      return;
    }

    const that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('微信用户信息:', res.userInfo);
              that.globalData.userInfo = {
                ...that.globalData.userInfo,
                nickname: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl
              };
              // 保存到本地存储
              wx.setStorageSync('userInfo', that.globalData.userInfo);
            },
            fail: function (err) {
              console.log('获取微信用户信息失败:', err);
            }
          });
        }
      }
    });
  },

  onShow: function () {
    // 每次小程序启动或从后台进入前台时执行
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const userInfo = wx.getStorageSync('userInfo');
    console.log('用户信息：', userInfo);
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
      // // 跳转到首页
      // wx.switchTab({
      //   url: '/pages/Home/Home'
      // });

    }
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