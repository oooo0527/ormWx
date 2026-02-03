Page({
  data: {
    timeOptions: [
      { title: '近期动态', icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/0e49b9877cc85990b16c319903c4ce63.jpg' },
      { title: '精彩瞬间', icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/5b326215758fd62df72aa42dc75ca5e4.jpg' },
      { title: '成长历程', icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/0e49b9877cc85990b16c319903c4ce63.jpg' },
      { title: '粉丝互动', icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/5b326215758fd62df72aa42dc75ca5e4.jpg' },
      { title: '作品回顾', icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/0e49b9877cc85990b16c319903c4ce63.jpg' },
      { title: '活动记录', icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/5b326215758fd62df72aa42dc75ca5e4.jpg' }
    ], // 页面固定数据，不需要从云数据库获取
    activeTab: 0, // 当前激活的tab索引
    // 自定义loading相关数据
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

  onLoad() {

  },



  // 切换tab
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    console.log('跳转到behindList页面，tab索引:', index);

    // 跳转到behindList页面并传递tab索引
    wx.navigateTo({
      url: `/packHome/behindList/behindList?tabIndex=${index}`
    });
  },



  // 处理内容区域的触摸开始事件
  onTouchStart(e) {
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
  },

  // 处理内容区域的触摸移动事件
  onTouchMove(e) {
    this.moveX = e.touches[0].pageX;
    this.moveY = e.touches[0].pageY;
  },

  // 处理内容区域的触摸结束事件
  onTouchEnd(e) {
    if (!this.startY || !this.moveY) return;

    const deltaX = this.moveX - this.startX;
    const deltaY = this.moveY - this.startY;

    // 判断是否为垂直滑动（垂直滑动距离大于水平滑动距离）

    if (deltaY > 30) { // 向下滑动，切换到下一个tab
      if (this.data.activeTab < this.data.timeOptions.length - 1) {
        this.switchTab({ currentTarget: { dataset: { index: this.data.activeTab + 1 } } });
      }
    } else if (deltaY < -30) { // 向上滑动，切换到上一个tab
      if (this.data.activeTab > 0) {
        this.switchTab({ currentTarget: { dataset: { index: this.data.activeTab - 1 } } });
      }
    }

  }
})