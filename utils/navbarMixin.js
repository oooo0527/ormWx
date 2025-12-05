// utils/navbarMixin.js
// 导航栏 mixin，用于处理导航栏高度动态计算

const systemInfo = require('./systemInfo.js');

const navbarMixin = {
  data: {
    navBarHeight: 0 // 导航栏高度
  },

  // 页面生命周期 - 加载时计算导航栏高度
  onLoadNavbarHeight: function () {
    this.calculateNavBarHeight();
  },

  // 计算导航栏高度
  calculateNavBarHeight: function () {
    systemInfo.getNavBarHeight().then(navBarHeight => {
      this.setData({
        navBarHeight: navBarHeight
      });

      // 如果页面有 onNavBarHeightCalculated 回调，则调用
      if (typeof this.onNavBarHeightCalculated === 'function') {
        this.onNavBarHeightCalculated(navBarHeight);
      }
    }).catch(() => {
      // 默认值
      this.setData({
        navBarHeight: 64
      });

      if (typeof this.onNavBarHeightCalculated === 'function') {
        this.onNavBarHeightCalculated(64);
      }
    });
  }
};

module.exports = navbarMixin;