// packageA/noteList/noteList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    announcementNotifications: [], // 公告消息列表
    showNotificationPopup: false, // 是否显示消息详情弹窗
    currentNotification: null, // 当前选中的消息
    popupNotifications: [], // 需要弹窗提醒的消息列表
    normalNotifications: [], // 普通通知列表
    currentTab: 'all', // 当前选中的标签页
    popupNotificationsUnreadCount: 0, // 弹窗提醒未读数量
    normalNotificationsUnreadCount: 0, // 普通通知未读数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时获取消息数据
    this.loadNotifications();

    // 初始化标签页
    this.setData({
      currentTab: 'all'
    });
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

    // 更新未读数量
    this.updateUnreadCounts();
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
        popupNotifications: cachedData.popupNotifications || [],
        normalNotifications: cachedData.normalNotifications || [],
      });

      // 更新未读数量
      this.updateUnreadCounts();

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

      // 按类型分类消息
      const popupNotifications = result.filter(item => item.type === 'popup');
      const normalNotifications = result.filter(item => item.type !== 'popup');

      // 设置数据
      const newData = {
        announcementNotifications: result,
        popupNotifications,
        normalNotifications
      };

      this.setData(newData);

      // 更新未读数量
      this.updateUnreadCounts();

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
      // 调用云函数获取公告消息
      wx.cloud.callFunction({
        name: 'rewordList', // 使用现有的rewordList云函数或创建新的云函数
        data: {
          action: 'getNotifications'
        },
        success: res => {
          console.log('获取消息成功', res);
          if (res.result && res.result.success) {
            // 确保每条消息都有必需的字段
            const notifications = (res.result.data || []).map(item => {
              // 如果没有type字段，默认为normal类型
              if (!item.type) {
                item.type = 'normal';
              }
              // 如果没有isRead字段，默认为false
              if (item.isRead === undefined) {
                item.isRead = false;
              }
              // 如果没有adminName字段，使用默认值
              if (!item.adminName) {
                item.adminName = '系统通知';
              }
              // 如果没有title字段，使用默认值
              if (!item.title) {
                item.title = '无标题';
              }
              // 如果没有content字段，使用默认值
              if (!item.content) {
                item.content = '无内容';
              }
              return item;
            });
            resolve(notifications);
          } else {
            console.error('获取消息失败', res);
            // 如果云函数调用失败，返回空数组
            resolve([]);
          }
        },
        fail: err => {
          console.error('调用云函数失败', err);
          // 如果云函数调用失败，返回空数组
          resolve([]);
        }
      });
    });
  },

  /**
   * 跳转到公告详情
   */
  // 显示消息详情弹窗
  showNotificationDetail(e) {
    const id = e.currentTarget.dataset.id;
    const allNotifications = [...this.data.popupNotifications, ...this.data.normalNotifications];
    const notification = allNotifications.find(item => item.id === id);

    if (notification) {
      this.setData({
        showNotificationPopup: true,
        currentNotification: notification
      });

      // 标记消息为已读
      this.markNotificationAsRead(id);
    }
  },

  // 隐藏消息详情弹窗
  hideNotificationPopup() {
    this.setData({
      showNotificationPopup: false,
      currentNotification: null
    });
  },

  // 标记消息为已读
  markNotificationAsRead(notificationId) {
    const allNotifications = [...this.data.popupNotifications, ...this.data.normalNotifications];
    const notificationIndex = allNotifications.findIndex(item => item.id === notificationId);

    if (notificationIndex !== -1) {
      allNotifications[notificationIndex].isRead = true;

      // 分别更新popup和normal数组
      const popupNotifications = allNotifications.filter(item => item.type === 'popup');
      const normalNotifications = allNotifications.filter(item => item.type !== 'popup');

      this.setData({
        popupNotifications,
        normalNotifications,
        announcementNotifications: allNotifications
      });

      // 更新缓存
      const cachedData = this.getCachedNotifications();
      if (cachedData) {
        cachedData.popupNotifications = popupNotifications;
        cachedData.normalNotifications = normalNotifications;
        cachedData.announcementNotifications = allNotifications;
        this.cacheNotifications(cachedData);
      }
    }
  },

  navigateToAnnouncement(e) {
    const id = e.currentTarget.dataset.id;
    console.log('查看公告详情，ID:', id);
    // 这里可以跳转到具体的公告详情页面
    // wx.navigateTo({
    //   url: `/pages/announcementDetail/announcementDetail?id=${id}`
    // });
  },

  // 获取未读消息数量
  getUnreadCount() {
    const allNotifications = [...this.data.popupNotifications, ...this.data.normalNotifications];
    const unreadCount = allNotifications.filter(item => !item.isRead).length;
    return unreadCount;
  },

  // 更新未读消息数量
  updateUnreadCounts() {
    const popupUnreadCount = this.data.popupNotifications.filter(item => !item.isRead).length;
    const normalUnreadCount = this.data.normalNotifications.filter(item => !item.isRead).length;

    this.setData({
      popupNotificationsUnreadCount: popupUnreadCount,
      normalNotificationsUnreadCount: normalUnreadCount
    });
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
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

  // 获取需要弹窗提醒的消息
  getPopupNotifications() {
    return this.data.popupNotifications.filter(item => !item.isRead);
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
      // 按类型分类消息
      const popupNotifications = result.filter(item => item.type === 'popup');
      const normalNotifications = result.filter(item => item.type !== 'popup');

      // 更新缓存
      const newData = {
        announcementNotifications: result,
        popupNotifications,
        normalNotifications,
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