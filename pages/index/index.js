Page({
  data: {
    isLogin: false,
    userInfo: null
  },

  onLoad: function () {
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

  // 跳转到登录页
  goToLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到个人中心
  goToProfile: function () {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  // 跳转到明星档案
  goToStarArchive: function () {
    wx.switchTab({
      url: '/pages/starArchive/starArchive'
    });
  },

  // 跳转到数据工坊
  goToDataWorkshop: function () {
    wx.switchTab({
      url: '/pages/dataWorkshop/dataWorkshop'
    });
  },

  // 跳转到作品安利
  goToWorkRecommend: function () {
    wx.switchTab({
      url: '/pages/workRecommend/workRecommend'
    });
  },

  // 跳转到粉丝心声
  goToFanVoice: function () {
    wx.switchTab({
      url: '/pages/fanVoice/fanVoice'
    });
  }
});