// packHome/behindList/behindList.js
Page({
  data: {
    menuData: {}, // 存储每个tab对应的菜单数据
    // 自定义loading相关数据
    showCustomLoading: false,
    navBarHeight: 0
  },

  // 显示自定义loading
  showCustomLoading: function () {

    this.setData({
      showCustomLoading: true,

    });
  },

  // 隐藏自定义loading
  hideCustomLoading: function () {
    this.setData({
      showCustomLoading: false
    });
  },
  onLoad(options) {
    // 获取导航栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      navBarHeight: systemInfo.statusBarHeight + 46 // 一般导航栏高度为46px
    });

    // 获取传入的tab索引，默认为0
    const tabIndex = parseInt(options.tabIndex) || 0;
    // 设置当前激活的tab
    console.log('当前激活的tab:', tabIndex);
    this.setData({
      activeTab: tabIndex
    });

    // 初始化页面，加载指定tab的菜单数据
    this.loadTabMenuData(tabIndex);


  },

  // 加载指定tab的菜单数据（通过云函数）
  loadTabMenuData(tabIndex) {
    this.showCustomLoading();

    wx.cloud.callFunction({
      name: 'behind',
      data: {
        action: 'getTabMenuData',
        type: tabIndex + ''
      },
      success: res => {
        let menuItems;
        menuItems = res.result.data;

        this.setData({
          currentMenuItems: menuItems
        });
      },
      fail: err => {
        console.error('调用云函数失败:', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
    this.hideCustomLoading();
  },
  // 卡片点击事件
  onCardTap(e) {
    const item = e.currentTarget.dataset.item;
    console.log('点击了卡片:', item);
    wx.navigateTo({
      url: '/packHome/bookDetail/bookDetail',
      routeType: 'wx://cupertino-modal',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromBookPage', {
          Box: item
        });
      }
    });
  },


  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})