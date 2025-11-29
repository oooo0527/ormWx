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
    image: '/components/customNavbar/tabBg.png'
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      // 获取状态栏高度
      systemInfo.getStatusBarHeight().then(height => {
        this.setData({
          statusBarHeight: height
        });
      });
    }
  },

  methods: {
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