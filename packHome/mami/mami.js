Page({
  data: {
    tabs: [
      { name: 'Tab 1', id: 0 },
      { name: 'Tab 2', id: 1 },
      { name: 'Tab 3', id: 2 }
    ],
    activeTab: 0, // 当前激活的tab
    tabContents: [], // 从云数据库获取的图片数据
    currentImageIndex: 0, // 当前图片索引
    startX: 0, // 触摸开始位置
    isSwiping: false, // 是否正在滑动
    navBarHeight: 0, // 导航栏高度
    type: 'fade',
    duration: 300,
    closedElevation: 1,
    closedBorderRadius: 4,
    openElevation: 4,
    openBorderRadius: 0,
    showCustomLoading: false,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取导航栏高度
    const systemInfo = wx.getSystemInfoSync();
    const navBarHeight = systemInfo.statusBarHeight + 46; // 状态栏高度 + 导航栏固定高度

    this.setData({
      navBarHeight: navBarHeight,
      currentImageIndex: 0
    });

    // 加载云数据库中的图片数据
    this.loadTabContents();
  },

  /**
   * 从云函数加载tab图片数据
   */
  loadTabContents() {
    this.showCustomLoading();

    // 调用云函数获取数据
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'getMamiImages',
        tabId: this.data.activeTab
      }
    })
      .then(res => {
        this.hideCustomLoading();

        if (res.result && res.result.success && res.result.data) {
          this.setData({
            tabContents: res.result.data
          });

          console.log('图片数据加载成功', res.result.data);
        } else {
          // 如果没有数据，使用默认数据
          this.setData({
            tabContents: [
              ['cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/3bbcdd4f3b117240c62fdf2f53b6855c.png'],
              ['cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/3bbcdd4f3b117240c62fdf2f53b6855c.png'],
              ['cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/3bbcdd4f3b117240c62fdf2f53b6855c.png']
            ]
          });

          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        this.hideCustomLoading();
        console.error('加载图片数据失败', err);

        // 加载失败时使用默认数据
        this.setData({
          tabContents: [
            ['cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/3bbcdd4f3b117240c62fdf2f53b6855c.png'],
            ['cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/3bbcdd4f3b117240c62fdf2f53b6855c.png'],
            ['cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/3bbcdd4f3b117240c62fdf2f53b6855c.png']
          ]
        });

        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  /**
   * 切换tab
   */
  switchTab(e) {
    const tabId = e.currentTarget.dataset.tabid;
    this.setData({
      activeTab: tabId,
      currentImageIndex: 0
    });
  },

  /**
   * 触摸开始事件
   */
  touchStart(e) {
    this.setData({
      startX: e.touches[0].clientX,
      isSwiping: true
    });
  },

  /**
   * 触摸移动事件
   */
  touchMove(e) {
    if (!this.data.isSwiping) return;
    // 此处可以添加滑动动画效果
  },

  /**
   * 触摸结束事件
   */
  touchEnd(e) {
    if (!this.data.isSwiping) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = endX - this.data.startX;
    const minSwipeDistance = 50; // 最小滑动距离

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX < 0) {
        // 向右滑动，切换到上一个tab
        this.prevTab();
      } else {
        // 向左滑动，切换到下一个tab
        this.nextTab();
      }
    }

    this.setData({
      isSwiping: false
    });
  },

  /**
   * 切换到下一个tab
   */
  nextTab() {
    let nextTab = this.data.activeTab + 1;
    if (nextTab >= this.data.tabs.length) {
      nextTab = 0; // 循环回到第一个tab
    }
    this.setData({
      activeTab: nextTab,
      currentImageIndex: 0
    });
  },

  /**
   * 切换到上一个tab
   */
  prevTab() {
    let prevTab = this.data.activeTab - 1;
    if (prevTab < 0) {
      prevTab = this.data.tabs.length - 1; // 循环到最后一个tab
    }
    this.setData({
      activeTab: prevTab,
      currentImageIndex: 0
    });
  },

  /**
   * 预览图片
   */
  viewPhoto(e) {
    const index = e.currentTarget.dataset.image;
    const currentTabImages = this.data.tabContents[index].imgUrl;
    wx.previewImage({
      current: currentTabImages,
      urls: this.data.tabContents.map(item => item.imgUrl)
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 上拉触底
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'mami - 图片展示',
      path: '/packHome/mami/mami'
    };
  }
})