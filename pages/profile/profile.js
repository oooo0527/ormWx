Page({
  data: {
    userInfo: null,
    isLogin: false,
    showEditForm: false,
    editNickname: '',
    editAvatar: ''
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
      userInfo: app.globalData.userInfo,
      editNickname: app.globalData.userInfo ? app.globalData.userInfo.nickname : '',
      editAvatar: app.globalData.userInfo ? app.globalData.userInfo.avatar : ''
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
  },

  // 前往登录页面
  goToLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 显示编辑表单
  showEditForm: function () {
    this.setData({
      showEditForm: true,
      editNickname: this.data.userInfo ? this.data.userInfo.nickname : '',
      editAvatar: this.data.userInfo ? this.data.userInfo.avatar : ''
    });
  },

  // 隐藏编辑表单
  hideEditForm: function () {
    this.setData({
      showEditForm: false
    });
  },

  // 输入昵称
  onNicknameInput: function (e) {
    this.setData({
      editNickname: e.detail.value
    });
  },

  // 输入头像URL
  onAvatarInput: function (e) {
    this.setData({
      editAvatar: e.detail.value
    });
  },

  // 更新用户信息
  updateUserInfo: function () {
    const { editNickname, editAvatar } = this.data;

    if (!editNickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    // 调用云函数更新用户信息
    wx.cloud.callFunction({
      name: 'user',
      data: {
        action: 'updateUserInfo',
        nickname: editNickname,
        avatar: editAvatar
      }
    }).then(res => {
      if (res.result.success) {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });

        // 更新本地存储和全局数据
        const updatedUserInfo = {
          ...this.data.userInfo,
          nickname: editNickname,
          avatar: editAvatar
        };

        wx.setStorageSync('userInfo', updatedUserInfo);

        const app = getApp();
        app.globalData.userInfo = updatedUserInfo;

        this.setData({
          userInfo: updatedUserInfo,
          showEditForm: false
        });
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('更新失败', err);
      wx.showToast({
        title: '更新失败',
        icon: 'none'
      });
    });
  }
});