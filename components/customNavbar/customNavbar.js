// components/customNavbar/customNavbar.js
const systemInfo = require('../../utils/systemInfo.js');

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {
    title: {
      type: String,
      value: '明星互动平台'
    },
    backgroundColor: {
      type: String,
      value: ''
    },
    scrolledBackgroundColor: {
      type: String,
      value: '#f48eb5'
    },
    textColor: {
      type: String,
      value: '#ffffff'
    },
    showBack: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 0, // 添加导航栏高度数据
    image: '/components/customNavbar/tabBg.png',
    isScrolled: false
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      // 获取状态栏高度和导航栏高度
      Promise.all([
        systemInfo.getStatusBarHeight(),
        systemInfo.getNavBarHeight()
      ]).then(([statusBarHeight, navBarHeight]) => {
        this.setData({
          statusBarHeight: statusBarHeight,
          navBarHeight: navBarHeight
        });

        // 触发事件，将导航栏高度传递给父组件
        this.triggerEvent('navbarheightchange', {
          navBarHeight: navBarHeight,
          statusBarHeight: statusBarHeight
        });

        // 同时将导航栏高度设置到页面的全局数据中
        const pages = getCurrentPages();
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          if (currentPage) {
            currentPage.setData({
              navBarHeight: navBarHeight
            });
          }
        }
      }).catch(() => {
        // 默认值
        this.setData({
          statusBarHeight: 20,
          navBarHeight: 64
        });

        // 触发事件，将导航栏高度传递给父组件
        this.triggerEvent('navbarheightchange', {
          navBarHeight: 64,
          statusBarHeight: 20
        });

        // 同时将导航栏高度设置到页面的全局数据中
        const pages = getCurrentPages();
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          if (currentPage) {
            currentPage.setData({
              navBarHeight: 64
            });
          }
        }
      });
    },

    ready: function () {
      // 在组件完全准备好后绑定页面滚动事件
      this.bindPageScroll();
    }
  },

  pageLifetimes: {
    show: function () {
      // 页面显示时重新绑定滚动事件
      this.bindPageScroll();
    }
  },

  methods: {
    // 绑定页面滚动事件
    bindPageScroll: function () {
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];

        // 保存组件实例的引用
        const component = this;

        // 保存原始的onPageScroll方法
        const originalOnPageScroll = currentPage.onPageScroll;

        // 重写onPageScroll方法
        currentPage.onPageScroll = function (e) {
          // 调用原始方法（如果存在）
          if (originalOnPageScroll) {
            originalOnPageScroll.call(this, e);
          }

          // 判断滚动位置并更新导航栏样式
          const isScrolled = e.scrollTop > 50;
          // console.log('Scroll position:', e.scrollTop, 'isScrolled:', isScrolled);
          if (component.data.isScrolled !== isScrolled) {
            component.setData({
              isScrolled: isScrolled
            });
          }
        };
      }
    },

    // 返回上一页
    onBack: function () {
      if (getCurrentPages().length > 1) {
        wx.navigateBack({
          delta: 1
        });
      } else {
        // 如果没有上一页，则返回首页
        wx.switchTab({
          url: '/pages/Home/Home'
        });
      }
    },

    // 返回首页
    onHome: function () {
      wx.switchTab({
        url: '/pages/Home/Home'
      });
    }
  }
})