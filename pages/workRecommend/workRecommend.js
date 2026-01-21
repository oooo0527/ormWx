Page({

  data: {
    type: 'fade',
    duration: 300,
    closedElevation: 1,
    closedBorderRadius: 4,
    openElevation: 4,
    openBorderRadius: 0,
    currentCarousel: 0,
    countdown: {
      days: 0,
      hours: 0,
      minutes: 0
    },
    works: [
      {
        id: 1,
        title: "我家妹妹不准嫁",
        role: "小翁",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
      },
    ]
  },

  onLoad: function () {
    // 初始化倒计时
    this.initCountdown();
  },

  onShow: function () {
    // 页面显示时启动倒计时
    this.startCountdown();
  },

  onHide: function () {
    // 页面隐藏时停止倒计时
    this.stopCountdown();
  },

  initCountdown: function () {
    // 设置目标日期为2026年05月27日
    const targetDate = new Date(2026, 4, 27); // 注意月份从0开始，5月是4

    this.setData({
      targetTimestamp: targetDate.getTime()
    });
  },

  startCountdown: function () {
    // 启动倒计时
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 60000); // 每分钟更新一次
  },

  stopCountdown: function () {
    // 清除倒计时定时器
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  },

  updateCountdown: function () {
    const now = new Date().getTime();
    const targetTime = this.data.targetTimestamp;

    if (targetTime) {
      const distance = targetTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        this.setData({
          countdown: {
            days: days,
            hours: hours,
            minutes: minutes
          }
        });
      } else {
        // 倒计时结束
        this.setData({
          countdown: {
            days: 0,
            hours: 0,
            minutes: 0
          }
        });
        this.stopCountdown();
      }
    }
  },

  // 轮播图变化事件
  onCarouselChange: function (e) {
    this.setData({
      currentCarousel: e.detail.current
    });
  },

  // 卡片点击事件
  onCardTap: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentCarousel: index
    });

    const currentWork = this.data.works[this.data.currentCarousel];
    wx.navigateTo({
      url: `/pages/workDetail/workDetail?work=${encodeURIComponent(JSON.stringify(currentWork))}`
    });
  },

  onUnload: function () {
    // 页面卸载时清除倒计时定时器
    this.stopCountdown();
  }
})