// 引入基类页面创建函数
const { createPage } = require('../../utils/basePage.js');

// 使用 createPage 创建页面，自动包含导航栏高度处理功能
createPage({
  data: {
    customNameListFlag: false,
    ormkornnaphat: {},


    menueList: [
      {
        title: '消息通知',
        path: '/packageA/noteList/noteList',
      },
      {
        title: '休闲',
        path: '/packageA/makeFree/makeFree',
      }
    ]

  },

  onLoad: function (options) {
    // 获取app实例
    const app = getApp();
    if (app.globalData.ormkornnaphat) {
      this.setData({
        ormkornnaphat: app.globalData.ormkornnaphat
      });
    }

  },

  onShow: function () {
    const app = getApp();
    if (app.globalData.ormkornnaphat && !this.data.ormkornnaphat) {
      this.setData({
        ormkornnaphat: app.globalData.ormkornnaphat
      });
    }



  },


  navigateToPage(e) {
    console.log(e);
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  // 页面滚动事件
  onPageScroll: function (e) {
    // 空函数，用于被自定义导航栏组件重写
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 什么都不做，只是阻止事件冒泡
  }
})