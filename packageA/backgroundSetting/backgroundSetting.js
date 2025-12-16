// pages/backgroundSetting/backgroundSetting.js
Page({
  data: {
    // 背景设置相关数据（已更新为白色背景方案）
    backgroundSettings: {
      type: 'color',
      value: 'linear-gradient(0deg, #000000 0%, #f5f5f5 40%, #f5f5f5 100%)',
      customImage: ''
    },
    colorOptions: [
      '#E9E8EF', '#f5f5f5', '#1E2020'
    ],
    gradientOptions: [
      'linear-gradient(180deg, #E9E8EF 0%, #1E2020 100%)',
      'linear-gradient(180deg, #1E2020 0%, #E9E8EF 100%)',
      'linear-gradient(135deg, #E9E8EF 0%, #1E2020 100%)',
      'linear-gradient(135deg, #f5f5f5 0%, #1E2020 100%)',
    ]
  },

  onLoad: function (options) {
    // 从全局数据获取背景设置（使用白色背景方案）
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
      type: 'color',
      value: '#E9E8EF',
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