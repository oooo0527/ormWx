// 引入基类页面创建函数
const { createPage } = require('../../utils/basePage.js');

// 使用 createPage 创建页面，自动包含导航栏高度处理功能
createPage({
  data: {

    menueList: [
      {
        title: '消息通知',
        path: '/packageA/noteList/noteList',
      },
    ]

  },

  onLoad: function (options) {

  },

  onShow: function () {

  },

  navigateToPage(e) {
    console.log(e);
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },





  // 跳转到背景设置页面
  goToBackgroundSetting: function () {
    wx.navigateTo({
      url: '/packageA/backgroundSetting/backgroundSetting'
    });
  },

  // 页面滚动事件
  onPageScroll: function (e) {
    // 空函数，用于被自定义导航栏组件重写
  }
})