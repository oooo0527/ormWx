// packageA/noteList/noteList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    announcementNotifications: [], // 公告消息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时获取消息数据
    this.loadNotifications();
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
    // 每次显示页面时重新加载消息数据
    this.loadNotifications();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新时重新加载消息数据
    this.loadNotifications(() => {
      wx.stopPullDownRefresh();
    });
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
   * 加载消息数据 - 增强版本，支持缓存机制
   */
  loadNotifications(callback) {


    // 检查是否有缓存数据且未过期（5分钟内）
    const cachedData = this.getCachedNotifications();
    if (cachedData && !this.isCacheExpired(cachedData.timestamp)) {
      console.log('使用缓存数据');
      // 使用缓存数据更新页面
      this.setData({
        announcementNotifications: cachedData.announcementNotifications,
      });

      // 执行回调函数（如果有）
      if (callback && typeof callback === 'function') {
        callback();
      }

      // 异步更新缓存数据（不影响当前显示）
      this.fetchAndCacheNotifications();
      return;
    }

    // 没有有效缓存，显示加载提示并从服务器获取数据
    wx.showLoading({
      title: '加载中...'
    });

    // 获取公告消息（这里模拟数据，实际应从数据库获取）
    this.getAnnouncementNotifications().then(result => {
      // 隐藏加载提示
      wx.hideLoading();

      // 设置数据
      const newData = {
        announcementNotifications: result,
      };

      this.setData(newData);

      // 缓存数据
      this.cacheNotifications(newData);

      // 执行回调函数（如果有）
      if (callback && typeof callback === 'function') {
        callback();
      }
    }).catch(err => {
      // 隐藏加载提示
      wx.hideLoading();

      console.error('加载消息失败：', err);
      wx.showToast({
        title: '加载消息失败，请稍后再试',
        icon: 'none'
      });

      // 执行回调函数（如果有）
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  },


  /**
   * 获取公告消息
   */
  getAnnouncementNotifications() {
    return new Promise((resolve, reject) => {
      // 这里需要一个专门的云函数来获取公告消息
      // 由于当前云函数没有提供此功能，暂时模拟数据
      // 在实际开发中，应该有一个云函数可以查询公告信息

      // 模拟数据
      const notifications = [
        {
          id: '1',
          adminName: '系统管理员',
          adminAvatar: '/images/admin-avatar.png',
          title: '系统维护通知',
          content: '系统将于今晚00:00-02:00进行维护，期间可能会出现服务不稳定的情况，请大家谅解。',
          time: '2023-05-15'
        },
        {
          id: '2',
          adminName: '运营团队',
          adminAvatar: '/images/admin-avatar.png',
          title: '新功能上线',
          content: '我们上线了全新的消息中心功能，欢迎大家体验并提出宝贵意见！',
          time: '2023-05-10'
        }
      ];

      resolve(notifications);
    });
  },

  /**
   * 跳转到公告详情
   */
  navigateToAnnouncement(e) {
    const id = e.currentTarget.dataset.id;
    console.log('查看公告详情，ID:', id);
    // 这里可以跳转到具体的公告详情页面
    // wx.navigateTo({
    //   url: `/pages/announcementDetail/announcementDetail?id=${id}`
    // });
  },

  /**
   * 缓存通知数据
   */
  cacheNotifications(data) {
    const cacheData = {
      ...data,
      timestamp: Date.now() // 添加时间戳
    };
    try {
      wx.setStorageSync('notificationCache', cacheData);
      console.log('通知数据已缓存');
    } catch (e) {
      console.error('缓存通知数据失败：', e);
    }
  },

  /**
   * 获取缓存的通知数据
   */
  getCachedNotifications() {
    try {
      const cacheData = wx.getStorageSync('notificationCache');
      return cacheData || null;
    } catch (e) {
      console.error('获取缓存通知数据失败：', e);
      return null;
    }
  },

  /**
   * 检查缓存是否过期（5分钟有效期）
   */
  isCacheExpired(timestamp) {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5分钟毫秒数
    return (now - timestamp) > fiveMinutes;
  },

  /**
   * 异步获取并缓存最新的通知数据
   */
  fetchAndCacheNotifications() {
    // 获取最新公告消息
    this.getAnnouncementNotifications().then(result => {
      // 更新缓存
      const newData = {
        announcementNotifications: result,
        timestamp: Date.now() // 更新时间戳
      };

      try {
        wx.setStorageSync('notificationCache', newData);
        console.log('缓存数据已更新');
      } catch (e) {
        console.error('更新缓存数据失败：', e);
      }
    }).catch(err => {
      console.error('异步更新缓存数据失败：', err);
    });
  }
});