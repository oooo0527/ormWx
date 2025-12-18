Page({
  data: {
    // 页面数据
  },

  onLoad: function (options) {
    // 页面加载时执行
  },

  onShow: function () {
    // 页面显示时执行
  },

  // 导航到指定页面
  navigateToPage: function (e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url
      });
    }
  },

  // 菜单触摸开始事件
  onTouchStart: function (e) {
    const dataset = e.currentTarget.dataset;
    const index = dataset.index;
    console.log('触摸菜单项:', index);

    // 暂停动画效果
    const query = wx.createSelectorQuery();
    query.select('.menu-item').boundingClientRect();
    query.exec((res) => {
      console.log('暂停菜单动画');
    });
  },

  // 菜单触摸结束事件
  onTouchEnd: function (e) {
    const dataset = e.currentTarget.dataset;
    const index = dataset.index;
    console.log('释放菜单项:', index);

    // 恢复动画效果
    setTimeout(() => {
      console.log('恢复菜单动画');
    }, 300);
  }
});