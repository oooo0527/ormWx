// pages/backgroundSetting/backgroundSetting.js
Page({
  data: {
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
    // 从全局数据获取背景设置
    const app = getApp();
    this.setData({
      backgroundSettings: app.globalData.backgroundSettings
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
  }
})