Page({
  data: {
    selectedStar: null,

    // 菜单信息 - 将从后台获取
    menuList: [],
    contentList: [],
    musicList: [],
    // 灯泡弹窗相关数据
    showLampPopup: false,
    isLampOn: false,
    eventsData: [],
    // 弹窗提醒相关数据
    showNotificationPopup: false,
    notificationList: []
  },
  onLoad: function (options) {
    this.loadImageConfig();

    // 检查是否需要显示每日弹窗提醒
    this.checkDailyNotificationPopup();
  },

  onShow: function () {
    // 页面显示时也可以重新加载配置
    // this.loadImageConfig();

    // 检查是否需要显示每日弹窗提醒
    this.checkDailyNotificationPopup();
  },

  // 加载图片配置
  loadImageConfig: function () {
    wx.showLoading({
      title: '加载中...'
    });

    wx.cloud.callFunction({
      name: 'imageConfig',
      data: {
        action: 'getImageConfig',
        configType: 'home_menu',
        configName: 'menuList'
      }
    }).then(res => {
      console.log(res, 'getImageConfig')
      if (res.result.success && res.result.data.length > 0) {
        this.setData({
          menuList: res.result.data || []
        });
      } else {
        // 如果没有从后台获取到数据，使用默认配置
        this.setData({
          menuList: [
            {
              name: '时间线',
              url: '/packHome/growthTimeline/growthTimeline',
              icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/时.jpg'
            },
            {
              name: '妈粉',
              url: '/packHome/mami/mami',
              icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/妈.jpg'
            },
            {
              name: '梦女',
              url: '/packHome/dream/dream',
              icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/梦.jpg'
            }, {
              name: '人缘',
              url: '/packHome/ormHome/ormHome',
              icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/缘.jpg'
            }, {
              name: 'behind',
              url: '/packHome/behind/behind',
              icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/后.jpg'
            }
          ]
        });
      }

      // 获取内容列表配置
      wx.cloud.callFunction({
        name: 'imageConfig',
        data: {
          action: 'getImageConfig',
          configType: 'home_content',
          configName: 'contentList'
        }
      }).then(res => {
        if (res.result.success && res.result.data.length > 0) {
          this.setData({
            contentList: res.result.data || []
          });
        } else {
          // 默认内容列表
          this.setData({
            contentList: [{
              name: '足',
              url: '/packHome/footPrints/footPrints',
              image: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpg"
            },
            {
              name: '语',
              url: '/packHome/rambling/rambling',
              image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpgg'
            }, {
              name: '高',
              url: '/packHome/highEmotion/highEmotion',
              image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpg'
            },
            {
              name: 'gu',
              image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpgg'
            }]
          });
        }

        // 获取音乐列表配置
        wx.cloud.callFunction({
          name: 'imageConfig',
          data: {
            action: 'getImageConfig',
            configType: 'home_music',
            configName: 'musicList'
          }
        }).then(res => {
          if (res.result.success && res.result.data.length > 0) {
            this.setData({
              musicList: res.result.data || []
            });
          } else {
            // 默认音乐列表
            this.setData({
              musicList: [{
                title: "上班必听",
                des: '你想象不到的音乐天才',
                url: '/packHome/musicPlayer/musicPlayer',
                image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/8a4a2aff10012ed22625321f6898bb84.jpg'
              }, {
                name: '争气',
                title: "争气",
                des: '从这里开始了解陈奥',
                url: '/packHome/Remarkable/Remarkable',
                image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/925db0f17c54d003a63bdfb90bfdd0c1.jpg'
              },
              {
                title: "NAPAT",
                des: 'NAPAT',
                url: '/packHome/rambling/rambling',
                image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/9a58f9ad40d364eb6022ccd8b78cbb82.jpg'
              }]
            });
          }

          wx.hideLoading();
        }).catch(err => {
          console.error('获取音乐列表配置失败', err);
          wx.hideLoading();
        });

      }).catch(err => {
        console.error('获取内容列表配置失败', err);
        wx.hideLoading();
      });
    }).catch(err => {
      console.error('获取菜单配置失败', err);
      wx.hideLoading();
    });
  },
  //跳转
  navigateToPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },

  // 关闭公告
  closeAnnouncement: function () {
    this.setData({
      'announcement.show': false
    });
  },

  // 切换灯泡弹窗显示状态（下拉效果）
  toggleLampPopup: function () {
    const showPopup = !this.data.showLampPopup;
    const lampOn = showPopup;

    this.setData({
      showLampPopup: showPopup,
      isLampOn: lampOn
    });

    // 如果是打开弹窗，则获取events数据
    if (showPopup) {
      this.getEventsData();
    }
  },

  // 获取events云函数数据
  getEventsData: function () {
    // 获取当前月份
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    wx.cloud.callFunction({
      name: 'events',
      data: {
        action: 'getEvents',
        month: currentMonth
      }
    }).then(res => {
      console.log('获取events数据成功', res);
      if (res.result && res.result.success) {
        // 预处理事件数据，添加day和month字段
        const processedEvents = (res.result.data || []).map(event => {
          if (event.date) {
            const dateParts = event.date.split('-');
            if (dateParts.length === 3) {
              event.day = dateParts[2];
              event.month = this.getMonthName(dateParts[1]);
            }
          }
          return event;
        });

        this.setData({
          eventsData: processedEvents
        });
      } else {
        wx.showToast({
          title: '获取活动数据失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('获取events数据失败', err);
      wx.showToast({
        title: '获取活动数据失败',
        icon: 'none'
      });
    });
  },

  // 获取月份名称
  getMonthName: function (month) {
    const monthNames = {
      '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
      '05': 'MAY', '06': 'JUN', '07': 'JUL', '08': 'AUG',
      '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
    };
    return monthNames[month] || month || '';
  },

  // 事件点击处理
  onEventTap: function (e) {
    const event = e.currentTarget.dataset.event;
    wx.showModal({
      title: event.title,
      content: event.description,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 检查每日弹窗提醒
  checkDailyNotificationPopup: function () {
    // 获取当前日期
    const today = new Date().toDateString();

    // 从本地存储获取上次显示弹窗的日期
    try {
      const lastPopupDate = wx.getStorageSync('lastNotificationPopupDate');

      // 如果今天已经显示过弹窗，则不再显示
      if (lastPopupDate === today) {
        console.log('今天已经显示过弹窗提醒');
        return;
      }

      // 获取noteList页面的未读弹窗消息
      // 由于无法直接访问其他页面的数据，我们需要调用云函数获取消息
      this.fetchPopupNotifications();

    } catch (e) {
      console.error('获取本地存储失败：', e);
      // 如果获取失败，仍然尝试获取弹窗消息
      this.fetchPopupNotifications();
    }
  },

  // 获取需要弹窗提醒的消息
  fetchPopupNotifications: async function () {
    // 首先尝试从云函数获取数据
    let popupNotifications = await this.getPopupNotifications();
    console.log(popupNotifications, 'popupNotifications')


    if (popupNotifications && popupNotifications.length > 0) {
      // 显示弹窗
      this.setData({
        showNotificationPopup: true,
        notificationList: popupNotifications
      });

      // 记录今天已经显示过弹窗
      try {
        wx.setStorageSync('lastNotificationPopupDate', new Date().toDateString());
      } catch (e) {
        console.error('存储弹窗日期失败：', e);
      }
    }
  },

  // 获取弹窗消息
  getPopupNotifications: async function () {
    try {
      // 调用云函数获取通知消息
      const result = await wx.cloud.callFunction({
        name: 'rewordList',
        data: {
          action: 'getNotifications'
        }
      });

      if (result.result && result.result.success) {
        // 返回未读的弹窗消息
        const notifications = result.result.data || [];
        return notifications.filter(item => item.type === 'popup' && !item.isRead);
      } else {
        console.error('获取通知消息失败：', result.result.message);
        return [];
      }
    } catch (e) {
      console.error('获取通知消息失败：', e);
      return [];
    }
  },

  // 从缓存获取弹窗消息（备选方案）
  getPopupNotificationsFromCache: function () {
    try {
      const cacheData = wx.getStorageSync('notificationCache');
      if (cacheData && cacheData.popupNotifications) {
        // 返回未读的弹窗消息
        return cacheData.popupNotifications.filter(item => !item.isRead);
      }
    } catch (e) {
      console.error('获取缓存数据失败：', e);
    }

    return [];
  },

  // 隐藏弹窗提醒
  hideNotificationPopup: function () {
    this.setData({
      showNotificationPopup: false
    });
  }

})