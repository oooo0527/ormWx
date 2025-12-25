App({
  globalData: {
    menuList: [],
    contentList: [],
    musicList: [],
    apiUrl: 'https://your-api-url.com',
    // 全局背景设置
    backgroundSettings: {
      type: 'gradient', // 'color', 'gradient', 'image'
      value: 'linear-gradient(135deg, #0c1117 0%, #f48eb5 100%)', // 高级黑到淡粉渐变
      customImage: '' // 自定义图片路径
    },
    backgroundChangeListener: null // 背景变化监听器
  },

  onLaunch: function () {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-5gzybpqcd24b2b58',
        traceUser: true,
      });
    }

  },


  onShow: function () {

  },





  // 更新全局背景设置
  updateBackgroundSettings: function (settings) {
    this.globalData.backgroundSettings = settings;
    wx.setStorageSync('backgroundSettings', settings);

    // 通知所有页面更新背景
    if (this.globalData.backgroundChangeListener) {
      this.globalData.backgroundChangeListener(settings);
    }
  },

  // 获取当前背景样式
  getCurrentBackgroundStyle: function () {
    const settings = this.globalData.backgroundSettings;
    if (settings.type === 'image' && settings.customImage) {
      return `background-image: url(${settings.customImage}); background-size: cover; background-position: center;`;
    } else {
      return `background: ${settings.value};`;
    }
  }
})