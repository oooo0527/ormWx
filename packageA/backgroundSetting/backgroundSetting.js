// pages/backgroundSetting/backgroundSetting.js
Page({
  data: {
    // 背景设置相关数据
    backgroundSettings: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #0c1117 0%, #f48eb5 100%)',
      customImage: ''
    },
    colorOptions: [
      '#0c1117', '#f48eb5', '#ffffff'
    ],
    gradientOptions: [
      'linear-gradient(180deg, #0c1117 0%, #f48eb5 100%)',
      'linear-gradient(180deg, #f48eb5 0%, #0c1117 100%,)',
      'linear-gradient(135deg, #0c1117 0%, #ffffff 100%)',
      'linear-gradient(135deg, #f48eb5 0%, #ffffff 100%)',
      'linear-gradient(45deg, #0c1117 0%, #f48eb5 50%, #ffffff 100%)'
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
      value: 'linear-gradient(135deg, #0c1117 0%, #f48eb5 100%)',
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