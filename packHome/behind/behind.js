// packHome/behind/behind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    behindList: [
      'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg',
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/50a564a77eb43dd2c90f8294b03c1f91.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/6ca0533a7313c69c9e5a07cdeba38cd0.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/7107bc357e6ac46e53f504384e17e397.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/b8f60d5e2868949446ffc9cb92755af9.jpg",
      'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg',
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/50a564a77eb43dd2c90f8294b03c1f91.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/6ca0533a7313c69c9e5a07cdeba38cd0.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/7107bc357e6ac46e53f504384e17e397.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/b8f60d5e2868949446ffc9cb92755af9.jpg",
      'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg',
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/50a564a77eb43dd2c90f8294b03c1f91.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/6ca0533a7313c69c9e5a07cdeba38cd0.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/7107bc357e6ac46e53f504384e17e397.jpg",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/b8f60d5e2868949446ffc9cb92755af9.jpg",
    ],
    currentIndex: 0,
    currentImage: '',
    turning: false,
    turningDirection: '', // 'forward' 或 'backward'
    startX: 0,
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('behindList length:', this.data.behindList.length);

    // 从本地存储中获取上次浏览的位置
    const lastViewedIndex = wx.getStorageSync('behindLastViewedIndex') || 0;

    // 确保索引在有效范围内
    const validIndex = Math.min(lastViewedIndex, this.data.behindList.length - 1);

    // 设置当前图片和索引
    if (this.data.behindList.length > 0) {
      this.setData({
        currentIndex: validIndex,
        currentImage: this.data.behindList[validIndex]
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 页面隐藏时保存当前浏览位置
    this.saveCurrentPosition();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时保存当前浏览位置
    this.saveCurrentPosition();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 保存当前位置到本地存储
  saveCurrentPosition: function () {
    wx.setStorageSync('behindLastViewedIndex', this.data.currentIndex);
  },

  // 处理触摸开始
  handleTouchStart: function (e) {
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    });
  },

  // 处理触摸移动
  handleTouchMove: function (e) {
    // 阻止默认滚动行为
    e.preventDefault();
  },

  // 处理触摸结束
  handleTouchEnd: function (e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - this.data.startX;
    const deltaY = endY - this.data.startY;

    // 判断是否为水平滑动且滑动距离足够
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // 向右滑动，显示上一张图片
        this.prevImage();
      } else {
        // 向左滑动，显示下一张图片
        this.nextImage();
      }
    }
  },

  // 显示上一张图片
  prevImage: function () {
    if (this.data.currentIndex > 0) {
      this.setData({
        turning: true,
        turningDirection: 'backward'
      });

      setTimeout(() => {
        const newIndex = this.data.currentIndex - 1;
        this.setData({
          currentIndex: newIndex,
          currentImage: this.data.behindList[newIndex],
          turning: false,
          turningDirection: ''
        });

        // 保存当前位置
        this.saveCurrentPosition();
      }, 400);
    }
  },

  // 显示下一张图片
  nextImage: function () {
    if (this.data.currentIndex < this.data.behindList.length - 1) {
      this.setData({
        turning: true,
        turningDirection: 'forward'
      });

      setTimeout(() => {
        const newIndex = this.data.currentIndex + 1;
        this.setData({
          currentIndex: newIndex,
          currentImage: this.data.behindList[newIndex],
          turning: false,
          turningDirection: ''
        });

        // 保存当前位置
        this.saveCurrentPosition();
      }, 400);
    }
  }
})