// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#f77030",
    list: []
  },

  lifetimes: {
    attached() {
      this.initTabBar();
    }
  },
  pageLifetimes: {
    show() {
      // 页面显示时更新选中状态
      this.updateSelected();
    }
  },
  methods: {
    initTabBar() {
      // 从全局数据获取tabBar配置
      const app = getApp();
      const tabBar = app.globalData.tabBar;

      this.setData({
        selected: tabBar.selected,
        list: tabBar.list
      });

      // 将当前组件实例设置到全局
      app.setCustomTabBar(this);
    },

    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;


      // 跳转页面
      wx.switchTab({ url });
    },
    updateSelected() {
      // 获取当前页面路径
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPath = currentPage ? currentPage.route : '';

      if (currentPath) {
        // 确保路径格式正确（以 / 开头）
        const normalizedPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath;
        this.updateSelectedByPath(normalizedPath);
      }
    },
    updateSelectedByPath(path) {
      // 查找匹配的tab项
      const tabIndex = this.data.list.findIndex(item => {
        return item.pagePath === path;
      });

      if (tabIndex !== -1) {
        this.setData({
          selected: tabIndex
        });
      }
    }
  }
})