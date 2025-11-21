Page({
  data: {
    userInfo: null,
    isLogin: true,
    showEditForm: false,
    editNickname: '',
    editAvatar: ''
  },

  onLoad: function (options) {
    // this.checkLoginStatus();
  },

  onShow: function () {
    // this.checkLoginStatus();
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
      // 未登录则跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
  },

  // 显示编辑表单
  showEditForm: function () {
    this.setData({
      showEditForm: true,
      editNickname: this.data.userInfo.nickname,
      editAvatar: this.data.userInfo.avatar || ''
    });
  },

  // 隐藏编辑表单
  hideEditForm: function () {
    this.setData({
      showEditForm: false,
      editNickname: '',
      editAvatar: ''
    });
  },

  // 输入昵称
  onNicknameInput: function (e) {
    this.setData({
      editNickname: e.detail.value
    });
  },

  // 输入头像
  onAvatarInput: function (e) {
    this.setData({
      editAvatar: e.detail.value
    });
  },

  // 保存用户信息
  saveUserInfo: function () {
    const { editNickname, editAvatar } = this.data;

    if (!editNickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    // 这里应该调用云函数或API更新用户信息
    // 模拟更新成功
    const updatedUserInfo = {
      ...this.data.userInfo,
      nickname: editNickname,
      avatar: editAvatar || this.data.userInfo.avatar
    };

    // 更新本地存储
    wx.setStorageSync('userInfo', updatedUserInfo);

    // 更新全局数据
    const app = getApp();
    app.globalData.userInfo = updatedUserInfo;

    this.setData({
      userInfo: updatedUserInfo,
      showEditForm: false
    });

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          wx.removeStorageSync('userInfo');

          // 更新全局数据
          const app = getApp();
          app.globalData.userInfo = null;
          app.globalData.isLogin = false;

          this.setData({
            isLogin: false,
            userInfo: null
          });

          // 跳转到首页
          wx.redirectTo({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // 跳转到背景设置页面
  goToBackgroundSetting: function () {
    wx.navigateTo({
      url: '/pages/backgroundSetting/backgroundSetting'
    });
  }
})