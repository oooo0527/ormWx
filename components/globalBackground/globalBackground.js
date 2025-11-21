// components/globalBackground/globalBackground.js
Component({
  properties: {
    // 组件属性
  },

  data: {
    backgroundStyle: ''
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.updateBackground();

      // 监听背景变化
      this.backgroundChangeListener = getApp().globalData.backgroundChangeListener = (settings) => {
        this.onBackgroundChange(settings);
      };
    },

    detached: function () {
      // 组件实例从页面节点树移除时执行
      if (getApp().globalData.backgroundChangeListener) {
        delete getApp().globalData.backgroundChangeListener;
      }
    }
  },

  pageLifetimes: {
    show: function () {
      // 页面显示时更新背景
      this.updateBackground();
    }
  },

  methods: {
    // 更新背景样式
    updateBackground: function () {
      const app = getApp();
      const backgroundStyle = app.getCurrentBackgroundStyle();
      this.setData({
        backgroundStyle: backgroundStyle
      });
    },

    // 监听背景变化
    onBackgroundChange: function (settings) {
      const app = getApp();
      const backgroundStyle = app.getCurrentBackgroundStyle();
      this.setData({
        backgroundStyle: backgroundStyle
      });
    }
  }
})