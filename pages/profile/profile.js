Page({
  data: {
    userInfo: null,
    isLogin: false
  },

  onLoad: function (options) {
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  checkLoginStatus: function () {
    const app = getApp();
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo
    });
  },

  // 退出登录
  onLogout: function () {
    const app = getApp();
    app.logout();

    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    });

    // 延迟返回首页
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index'
      });
    }, 1500);
  }
});