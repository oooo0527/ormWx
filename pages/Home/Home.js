Page({
  data: {
    selectedStar: null,
    nameList: ['ORM', 'KORN', 'NAPAT'],
    // 菜单信息
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
    }],
    // 灯泡弹窗相关数据
    showLampPopup: false,
    isLampOn: false,
    eventsData: []
  },
  onLoad: function (options) {
    // 获取用户信息
    const app = getApp();
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  },

  onShow: function () {

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
  }

})