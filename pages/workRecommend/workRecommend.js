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
    works: [],
    navBarHeight: 0
  },

  onLoad: function () {
    // 获取导航栏高度
    const systemInfo = wx.getSystemInfoSync();
    const navBarHeight = systemInfo.statusBarHeight + 46; // 状态栏高度 + 导航栏固定高度

    this.setData({
      navBarHeight: navBarHeight
    });

    // 初始化倒计时
    this.initCountdown();

    // 加载作品数据
    this.loadWorksData();
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

  // 加载作品数据
  loadWorksData: function () {
    wx.showLoading({
      title: '加载中...',
    });

    // 调用云函数获取作品数据
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'getWorksData'
      }
    })
      .then(res => {
        wx.hideLoading();

        if (res.result && res.result.success && res.result.data) {
          this.setData({
            works: res.result.data
          });

          console.log('作品数据加载成功', res.result.data);
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载作品数据失败', err);

        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
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