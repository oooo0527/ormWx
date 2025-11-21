Page({
  data: {
    isLogin: false,
    userInfo: null
  },

  onLoad: function () {
    // 页面加载时检查登录状态
    this.checkLoginStatus();
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

  // 跳转到登录页
  goToLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到明星档案（游客访问）
  goToStarArchive: function () {
    wx.switchTab({
      url: '/pages/starArchive/starArchive'
    });
  }
});