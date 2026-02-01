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
    notificationList: [],
    // 自定义loading相关数据
    showCustomLoading: false,
    loadingImageUrl: '',
    loadingText: '加载中...',
    // 展开/收缩状态相关数据
    contentAreaOffset: '0rpx',
    isContentExpanded: false,
    maxSlideDistance: 400 // 最大滑动距离，单位rpx
  },
  onLoad: function (options) {
    this.loadImageConfig();

    // 检查是否需要显示每日弹窗提醒
    this.checkDailyNotificationPopup();
  },

  onShow: function () {

    // 检查是否需要显示每日弹窗提醒
    this.checkDailyNotificationPopup();


  },

  // 加载图片配置
  loadImageConfig: function () {
    this.showCustomLoading();

    // 查询全部配置
    wx.cloud.callFunction({
      name: 'imageConfig',
      data: {
        action: 'getImageConfig'
      }
    }).then(res => {
      console.log(res, 'getAllImageConfigs');

      if (res.result.success && res.result.data) {
        // 根据类型分类数据
        const allConfigs = res.result.data;
        console.log(allConfigs, 'allConfigs');

        // 按 configType 和 configName 分类数据
        const categorizedData = {};

        allConfigs.forEach(item => {
          const key = item.configType || item.configName;
          if (!categorizedData[key]) {
            categorizedData[key] = [];
          }
          categorizedData[key].push(item);
        });

        // 处理菜单列表
        const menuListData = categorizedData['home_menu'] || categorizedData['menuList'] || [];
        if (menuListData.length > 0) {
          this.setData({
            menuList: menuListData
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

        // 处理内容列表
        const contentListData = categorizedData['home_content'] || categorizedData['contentList'] || [];
        if (contentListData.length > 0) {
          this.setData({
            contentList: contentListData
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

        // 处理音乐列表
        const musicListData = categorizedData['home_music'] || categorizedData['musicList'] || [];
        if (musicListData.length > 0) {
          this.setData({
            musicList: musicListData
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

        this.hideCustomLoading();
      } else {
        // 如果获取全部配置失败，使用默认配置
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
          ],
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
          }],
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
        this.hideCustomLoading();
      }
    }).catch(err => {
      console.error('获取全部配置失败', err);
      // 如果出错，使用默认配置
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
        ],
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
        }],
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
      this.hideCustomLoading();
    });
  },
  // 跳转
  navigateToPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },

  // 处理菜单点击
  handleMenuTap: function (e) {
    const url = e.currentTarget.dataset.url;
    console.log('Menu item tapped', url);
    if (url) {
      wx.navigateTo({
        url: url
      });
    }
  },

  // 处理子卡片点击
  handleSubCardTap: function (e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url
      });
    }
  },

  // 处理主卡片点击
  handleMainCardTap: function (e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url
      });
    }
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

    this.setData({
      isLampOn: showPopup
    });

    // 如果是打开弹窗，则获取events数据
    if (showPopup) {
      this.getEventsData();
    } else {
      this.setData({
        showLampPopup: false
      });
    }
  },

  // 获取events云函数数据
  getEventsData: function () {
    // 获取当前月份
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    console.log('当前月份', currentMonth);

    wx.cloud.callFunction({
      name: 'events',
      data: {
        action: 'getEvents',
        month: currentMonth
      }
    }).then(res => {
      console.log('获取events数据成功', res);
      if (res.result && res.result.success && res.result.data.length > 0) {
        // 预处理事件数据，添加day和month字段
        const processedEvents = (res.result.data || []).map(event => {
          if (event.date) {
            // 处理时间戳格式的日期
            const date = new Date(event.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            event.day = day;
            event.month = this.getMonthName(month);

            // 同时保留原始日期字符串格式用于显示
            event.dateString = `${year}-${month}-${day}`;
          }
          return event;
        }).sort((a, b) => a.date - b.date);

        this.setData({
          showLampPopup: true,
          eventsData: processedEvents
        });
      } else {
        this.setData({
          showLampPopup: false,
          isLampOn: !this.data.isLampOn
        });
        wx.showToast({
          icon: 'error',
          mask: true,
          title: '暂无活动',
          icon: 'none'
        });

      }
    }).catch(err => {
      console.error('获取events数据失败', err);
      this.setData({
        showLampPopup: false,
        isLampOn: !this.data.isLampOn
      });
      wx.showToast({
        icon: 'error',
        mask: true,
        title: '暂无活动',
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
      // 可以传递特定日期参数，例如获取今天之前的消息
      this.fetchPopupNotifications(); // 默认获取今天之前的消息
      // 或者传递特定日期: this.fetchPopupNotifications('2024-12-31') // 获取2024年12月31日之前的消息

    } catch (e) {
      console.error('获取本地存储失败：', e);
      // 如果获取失败，仍然尝试获取弹窗消息
      this.fetchPopupNotifications();
    }
  },

  // 获取需要弹窗提醒的消息·
  fetchPopupNotifications: async function (beforeDate) {
    // 首先尝试从云函数获取数据
    let popupNotifications = await this.getPopupNotifications(beforeDate);
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
  getPopupNotifications: async function (beforeDate) {
    try {
      // 设置默认日期为今天2026-01-01格式
      const dateToUse = beforeDate || new Date().toISOString().split('T')[0];
      console.log('Using date:', dateToUse);

      // 调用云函数获取通知消息
      const result = await wx.cloud.callFunction({
        name: 'rewordList',
        data: {
          action: 'getNotifications',
          beforeDate: dateToUse  // 传入日期参数，获取该日期之前的通知
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
  getPopupNotificationsFromCache: function (beforeDate) {
    try {
      const cacheData = wx.getStorageSync('notificationCache');
      if (cacheData && cacheData.popupNotifications) {
        // 返回未读的弹窗消息
        let filteredNotifications = cacheData.popupNotifications.filter(item => !item.isRead);

        // 如果提供了日期参数，则进一步过滤
        if (beforeDate) {
          filteredNotifications = filteredNotifications.filter(item => {
            // 假设缓存中的消息也有createTime字段
            if (item.createTime) {
              const itemDate = new Date(item.createTime);
              const beforeDateObj = new Date(beforeDate);
              return itemDate < beforeDateObj;
            }
            return true; // 如果没有createTime字段，默认包含
          });
        }

        return filteredNotifications;
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

  // 点击切换内容区域展开/收缩状态
  toggleContentArea: function (e) {
    if (this.data.isContentExpanded) {
      // 当前是展开状态，点击后收缩回原位
      this.setData({
        contentAreaOffset: '0rpx',
        isContentExpanded: false
      });
    } else {
      // 当前是收缩状态，点击后展开占满屏幕
      const windowHeight = wx.getSystemInfoSync().windowHeight;
      // 计算展开时的偏移量，使内容区域向上移动，占据更多屏幕空间
      this.setData({
        contentAreaOffset: '-400rpx', // 向上移动400rpx以扩展显示区域
        isContentExpanded: true
      });
    }
  },

  // 防止事件冒泡
  preventTap: function () {
    // 空函数，用于阻止事件冒泡
  },
});