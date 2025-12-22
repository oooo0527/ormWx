Page({
  data: {
    works: {},
    showFlag: false,
    expandFlage: true,

  },
  /**
   * 页面滚动事件处理
   * 必须实现此方法以便自定义导航栏组件可以正确绑定滚动事件
   */
  onPageScroll: function (e) {
    // 空实现，但必须保留以便自定义导航栏组件可以绑定滚动事件
    // 实际的滚动处理由custom-navbar组件完成
  },

  onLoad: function (options) {
    console.log('999999999999999999')
    if (!this.data.showFlag) {
      // 获取从上一页传递过来的数据
      const eventChannel = this.getOpenerEventChannel();
      console.log('eventChannel', eventChannel)
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        console.log('da ta', data)
        this.setData({
          works: data.works,
          showFlag: true,

        });
      });
    }
  },

  // 页面卸载时不需要停止轮询
  onUnload: function () {
    // 不需要做任何事情
  },

  // 页面隐藏时不需要停止轮询
  onHide: function () {
    // 不需要做任何事情
  },

  // 页面显示时不需要重新启动轮询
  onShow: function () {
    // 不需要做任何事情
  },





})