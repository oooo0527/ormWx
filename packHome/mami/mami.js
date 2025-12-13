Page({
  data: {
    sadList: [
      'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vidio/4d645e1c94be9e5499268b126b66754e.mp4',
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vidio/7590fa4c84fdd9870f9a43a7932b9a86.mp4",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vidio/ca288c4ddbe48240fece19442acd0d4a.mp4",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vidio/cc77be29ce5303019579b3dda6d84bbd.mp4"
    ],
    currentVideoIndex: 0, // 当前播放视频的索引
    windowHeight: 0, // 窗口高度
    startY: 0, // 触摸开始位置
    moveY: 0, // 触摸移动位置
    isMoving: false, // 是否正在滑动
    slideDistance: 0, // 滑动距离
    videoContext: null // 视频上下文
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      windowHeight: systemInfo.windowHeight
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 创建视频上下文
    this.videoContext = wx.createVideoContext('videoPlayer');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时播放当前视频
    if (this.videoContext) {
      this.videoContext.play();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 页面隐藏时暂停视频播放
    if (this.videoContext) {
      this.videoContext.pause();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时停止视频播放
    if (this.videoContext) {
      this.videoContext.stop();
    }
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

  /**
   * 触摸开始事件
   */
  touchStart(e) {
    this.setData({
      startY: e.touches[0].clientY,
      isMoving: true
    });
  },

  /**
   * 触摸移动事件
   */
  touchMove(e) {
    if (!this.data.isMoving) return;

    const moveY = e.touches[0].clientY;
    const slideDistance = moveY - this.data.startY;

    this.setData({
      moveY: moveY,
      slideDistance: slideDistance
    });
  },

  /**
   * 触摸结束事件
   */
  touchEnd(e) {
    if (!this.data.isMoving) return;

    const moveY = e.changedTouches[0].clientY;
    const slideDistance = moveY - this.data.startY;
    const absDistance = Math.abs(slideDistance);
    const windowHeight = this.data.windowHeight;

    // 判断滑动方向和距离
    if (absDistance > windowHeight * 0.1) { // 滑动距离超过屏幕高度的10%
      if (slideDistance > 0) {
        // 向下滑动，播放上一个视频
        this.switchToPreviousVideo();
      } else {
        // 向上滑动，播放下一个视频
        this.switchToNextVideo();
      }
    }

    this.setData({
      isMoving: false,
      slideDistance: 0
    });
  },

  /**
   * 切换到上一个视频
   */
  switchToPreviousVideo() {
    const currentIndex = this.data.currentVideoIndex;
    if (currentIndex > 0) {
      this.setData({
        currentVideoIndex: currentIndex - 1
      });

      // 停止当前视频播放并播放新视频
      if (this.videoContext) {
        this.videoContext.stop();
        setTimeout(() => {
          this.videoContext.play();
        }, 100);
      }
    }
  },

  /**
   * 切换到下一个视频
   */
  switchToNextVideo() {
    const currentIndex = this.data.currentVideoIndex;
    const videoList = this.data.sadList;

    if (currentIndex < videoList.length - 1) {
      this.setData({
        currentVideoIndex: currentIndex + 1
      });

      // 停止当前视频播放并播放新视频
      if (this.videoContext) {
        this.videoContext.stop();
        setTimeout(() => {
          this.videoContext.play();
        }, 100);
      }
    }
  },

  /**
   * 视频播放结束事件
   */
  onVideoEnded() {
    // 视频播放结束后自动播放下一个视频
    this.switchToNextVideo();
  },

  /**
   * 视频播放错误事件
   */
  onVideoError(e) {
    console.error('视频播放错误:', e);
    wx.showToast({
      title: '视频播放出错',
      icon: 'none'
    });
  }
})