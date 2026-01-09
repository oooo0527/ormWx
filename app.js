App({
  globalData: {
    ormkornnaphat: {
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/时.jp'
    },

    // 全局背景设置
    backgroundSettings: {
      type: 'gradient', // 'color', 'gradient', 'image'
      value: 'linear-gradient(135deg, #0c1117 0%,rgb(247, 243, 245) 100%)', // 高级黑到淡粉渐变
      customImage: '' // 自定义图片路径
    },
    backgroundChangeListener: null, // 背景变化监听器

    // 全局tabBar状态
    tabBar: {
      selected: 0, // 默认选中首页
      color: "#7A7E83",
      selectedColor: "#f77030",
      list: [
        {
          pagePath: "/pages/Home/Home",
          iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
          selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
          text: "首页"
        },
        {
          pagePath: "/pages/interaction/interaction",
          iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
          selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
          text: "互动"
        },
        {
          pagePath: "/pages/workRecommend/workRecommend",
          iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
          selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
          text: "作品"
        },
        {
          pagePath: "/pages/profile/profile",
          iconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/light.png",
          selectedIconPath: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/orange.png",
          text: "煎蛋卷"
        }
      ]
    }
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
  },

  // 更新tabBar选中状态
  updateTabBarSelected: function (index) {
    this.globalData.tabBar.selected = index;

    // 通知自定义tabBar更新
    const customTabBar = this.globalData.customTabBar;
    if (customTabBar) {
      customTabBar.setData({
        selected: index
      });
    }
  },

  // 设置自定义tabBar实例
  setCustomTabBar: function (tabBar) {
    this.globalData.customTabBar = tabBar;
  }
})