Page({
  data: {
    // 页面数据
    showPopup: false,  // 控制弹窗显示
    popupOptions: [],  // 弹窗选项
    popupColor: '',    // 弹窗主题色
    selectedUrl: '',    // 选中的跳转链接
    relationShipList: [],
    randomH: [460, 480, 460, 470, 490],
    randomH1: [490, 470, 460, 480, 460]
  },

  onLoad: function (options) {
    // 页面加载时执行
    this.initMenu()
  },

  onShow: function () {
    // 页面显示时执行

  },
  //初始化菜单
  initMenu: function () {
    // 菜单初始化逻辑
    wx.cloud.callFunction({
      name: 'relationShip',
      data: {
        action: 'getOrmHomeData'
      }
    }).then(res => {
      console.log('获取relationShip数据成功', res);
      if (res.result && res.result.success) {
        this.setData({
          relationShipList: res.result.data || []
        });
        console.log('relationShipList', this.data.relationShipList);
      } else {
        wx.showToast({
          title: '获取活动数据失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('获取relationShip数据失败', err);
      wx.showToast({
        title: '获取relationShip数据失败',
        icon: 'none'
      });
    });
  },

  // 导航到指定页面 - 修改为弹窗功能
  navigateToPage: function (e) {
    const index = e.currentTarget.dataset.index;
    const colorClass = e.currentTarget.dataset.color || 'red';


    // 显示弹窗
    this.setData({
      showPopup: true,
      popupOptions: this.data.relationShipList[index].pageList,
      popupColor: colorClass
    });

  },

  // 选择弹窗选项并跳转
  selectPopupOption: function (e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showPopup: false
    })
    console.log('选择弹窗选项:', item);
    wx.navigateTo({
      url: '/packHome/ormHomeDetail/ormHomeDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOrmPage', {
          data: item,
        });
      }
    });

  },

  // 关闭弹窗
  closePopup: function () {
    this.setData({
      showPopup: false
    });
  },

  // 防止事件冒泡
  preventTap: function () {
    // 空函数，用于阻止事件冒泡
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