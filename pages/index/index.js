Page({
  data: {
    isLogin: false,
    userInfo: null,
    currentBackground: 0, // 当前背景索引
    backgrounds: [  // 背景数组
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 默认紫色渐变
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // 粉色渐变
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // 蓝色渐变
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // 绿色渐变
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'  // 橙色渐变
    ]
  },

  onLoad: function () {
    // 页面加载时检查登录状态
    this.checkLoginStatus();

    // 从本地存储获取背景设置
    const savedBackground = wx.getStorageSync('selectedBackground');
    if (savedBackground !== undefined && savedBackground !== null) {
      this.setData({
        currentBackground: savedBackground
      });
    }
  },

  onShow: function () {
    // 页面显示时检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
    } else {
      this.setData({
        isLogin: false,
        userInfo: null
      });
    }
  },

  // 跳转到登录页面
  goToLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到明星档案页面
  goToStarArchive: function () {
    wx.switchTab({
      url: '/pages/starArchive/starArchive'
    });
  },

  // 背景变化回调
  onBackgroundChange: function (settings) {
    // 由于使用了全局背景组件，这里不需要额外处理
  }
})