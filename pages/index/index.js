Page({
  data: {
    isLogin: false,
    userInfo: null,
    showEnvSelector: false,
    envId: ''
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

  // 显示环境选择器
  showEnvSelector: function () {
    this.setData({
      showEnvSelector: true
    });
  },

  // 隐藏环境选择器
  hideEnvSelector: function () {
    this.setData({
      showEnvSelector: false
    });
  },

  // 输入环境ID
  onEnvInput: function (e) {
    this.setData({
      envId: e.detail.value
    });
  },

  // 保存环境ID
  saveEnvId: function () {
    const envId = this.data.envId;
    if (!envId) {
      wx.showToast({
        title: '请输入环境ID',
        icon: 'none'
      });
      return;
    }

    // 保存到本地存储
    wx.setStorageSync('cloudEnvId', envId);

    // 重新初始化云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        env: envId,
        traceUser: true,
      });
    }

    this.setData({
      showEnvSelector: false
    });

    wx.showToast({
      title: '环境设置成功',
      icon: 'success'
    });
  },
});