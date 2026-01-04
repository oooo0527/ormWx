Page({
  data: {
    timeOptions: [], // 从云数据库获取的时间选项数据
    selectedTime: null,
    scrollTop: 100, // 初始滚动位置，跳过顶部占位符
    itemHeight: 100, // 每个项目的高度（rpx）
    animation: true,
    currentIndex: 0,
    visibleItems: 5, // 同时显示5个项目
    loading: true // 数据加载状态
  },

  onLoad() {
    // 从云数据库获取时间选项数据
    this.getTimeOptions();
  },

  // 从云数据库获取时间选项数据
  getTimeOptions() {
    wx.cloud.callFunction({
      name: 'timeOptions',
      data: {
        action: 'getTimeOptions'
      },
      success: res => {
        if (res.result.success) {
          const timeOptions = res.result.data;
          this.setData({
            timeOptions: timeOptions,
            loading: false
          });

          // 如果有数据，初始化选中第一个时间项
          if (timeOptions.length > 0) {
            this.setData({
              selectedTime: timeOptions[0],
              scrollTop: 200 // 初始滚动位置，跳过顶部占位符
            });
          }
        } else {
          console.error('获取时间选项失败:', res.result.message);
          this.setData({
            loading: false
          });
          wx.showToast({
            title: '数据加载失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  onScroll(e) {
    // 计算当前滚动位置对应的时间项
    const scrollTop = e.detail.scrollTop;
    const itemHeight = this.data.itemHeight;

    // 计算当前选中的项目索引，减去顶部占位符高度的影响
    const currentIndex = Math.round((scrollTop - 100) / itemHeight); // 减去顶部占位符的200px

    // 确保索引在有效范围内
    const maxIndex = this.data.timeOptions.length - 1;
    const validIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    if (validIndex !== this.data.currentIndex) {
      this.setData({
        currentIndex: validIndex,
        selectedTime: this.data.timeOptions[validIndex]
      });
    }
  },

  goToDetail() {
    const selected = this.data.selectedTime;
    console.log(selected, 'llllllllllllll')
    if (selected) {
      wx.navigateTo({
        url: '/packHome/bookDetail/bookDetail',
        success: (res) => {
          // 通过事件通道向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromBookPage', {
            Box: selected
          });
        }
      });

    }
  }
})