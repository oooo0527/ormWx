Page({
  data: {
    userInfo: null,
    isLogin: false,
    showEditForm: false,
    editNickname: '',
    editAvatar: '',
    // 背景设置相关数据
    backgroundSettings: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      customImage: ''
    },
    colorOptions: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ],
    gradientOptions: [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ]
  },

  onLoad: function (options) {
    this.checkLoginStatus();

    // 从全局数据获取背景设置
    const app = getApp();
    this.setData({
      backgroundSettings: app.globalData.backgroundSettings
    });
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const userInfo = true || wx.getStorageSync('userInfo');
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

  // 选择纯色背景
  selectBackgroundColor: function (e) {
    const color = e.currentTarget.dataset.color;
    const settings = {
      type: 'color',
      value: color,
      customImage: ''
    };

    this.updateBackgroundSettings(settings);
  },

  // 选择渐变背景
  selectGradientBackground: function (e) {
    const gradient = e.currentTarget.dataset.gradient;
    const settings = {
      type: 'gradient',
      value: gradient,
      customImage: ''
    };

    this.updateBackgroundSettings(settings);
  },

  // 上传自定义背景图片
  uploadCustomBackground: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        const settings = {
          type: 'image',
          value: '',
          customImage: tempFilePath
        };

        this.updateBackgroundSettings(settings);
      }
    });
  },

  // 重置为默认背景
  resetBackground: function () {
    const settings = {
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      customImage: ''
    };

    this.updateBackgroundSettings(settings);
  },

  // 更新背景设置
  updateBackgroundSettings: function (settings) {
    this.setData({
      backgroundSettings: settings
    });

    // 调用全局方法更新背景设置
    const app = getApp();
    app.updateBackgroundSettings(settings);

    wx.showToast({
      title: '背景已更新',
      icon: 'success'
    });
  },

  // 页面背景变化回调
  onBackgroundChange: function (settings) {
    this.setData({
      backgroundSettings: settings
    });
  }
})